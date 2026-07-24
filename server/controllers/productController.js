const categorySchema = require('../models/categorySchema')
const productSchema = require('../models/productSchema')
const { uploadToCloudinary, deleteToCloudinary } = require('../utils/cloudinaryService')
const responseHandler = require('../utils/responseHandler')

const SIZE_ENUM = ['S', 'M', 'L', 'XL', 'XXL', '3XL', 's', 'm', 'l', 'xl', 'xxl', '3xl']

// ====== Create Product (multipart: thumbnail + images)
const createProduct = async (req, res) => {
  try {
    const { title, slug, description, category, price, buyPrice, discountPercentage, variants, tags, isActive } = req.body
    const thumbnail = req.files?.thumbnail?.[0]
    const images = req.files?.images

    if (!title) return res.status(400).send({ message: 'Product Title is required.' })
    if (!slug) return res.status(400).send({ message: 'Product Slug is required.' })
    const existSlug = await productSchema.findOne({ slug: slug.toLowerCase() })
    if (existSlug) return res.status(400).send({ message: 'Slug already exist' })
    if (!description) return res.status(400).send({ message: 'Product Description is required.' })
    if (!category) return res.status(400).send({ message: 'Product Category is required.' })
    const existCategory = await categorySchema.findById(category)
    if (!existCategory) return res.status(400).send({ message: 'Invalid Category' })
    if (!price) return res.status(400).send({ message: 'Product Price is required.' })

    const variantData = JSON.parse(variants)

    if (!Array.isArray(variantData) || variantData.length === 0)
      return res.status(400).send({ message: 'Minimum 1 variants is required' })

    for (const variant of variantData) {
      if (!variant.sku) return res.status(400).send({ message: 'Sku is required' })
      if (!variant.size) return res.status(400).send({ message: 'Size is required' })
      if (!variant.color) return res.status(400).send({ message: 'Color is required' })
      if (!SIZE_ENUM.includes(variant.size)) return res.status(400).send({ message: 'Invalid size' })
      if (!variant.stock || variant.stock < 1)
        return res.status(400).send({ message: 'Stock is required & must more than 1' })
    }

    const skus = variantData.map((item) => item.sku)
    if (new Set(skus).size !== skus.length) return res.status(400).send({ message: 'Sku must be unique' })

    const existingProduct = await productSchema.findOne({ 'variants.sku': { $in: skus } })
    if (existingProduct) return res.status(400).send({ message: 'One or more SKU already exists in database' })

    if (!thumbnail) return res.status(400).send({ message: 'Product Thumbnail is Required' })
    if (images && images?.length > 4) return res.status(400).send({ message: 'You can upload max 4 images' })

    const thumbnailUrl = await uploadToCloudinary(thumbnail, 'thumbnail')
    const imagesUrl = []
    if (images) {
      for (const img of images) {
        const imgUrl = await uploadToCloudinary(img, 'product')
        imagesUrl.push(imgUrl.secure_url)
      }
    }

    const product = productSchema({
      title,
      slug: slug.toLowerCase(),
      description,
      category,
      price,
      buyPrice,
      discountPercentage,
      variants: variantData,
      tags,
      thumbnail: thumbnailUrl.secure_url,
      images: imagesUrl,
      isActive,
    })
    await product.save()

    res.status(200).send({ message: 'Product create successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server' })
  }
}

// ====== Get Product List (aggregation + $lookup category + pagination)
const getProductList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skipIndex = (page - 1) * limit
    const category = req.query.category
    const search = req.query.search

    const totalProducts = await productSchema.countDocuments()

    const pipeline = [
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: '$category' },
      { $sort: { createdAt: -1 } },
      { $skip: skipIndex },
      { $limit: limit },
      { $project: { buyPrice: 0 } }, // never expose cost price to the storefront
    ]

    if (category) {
      pipeline.push({ $match: { 'category.name': category || { $regex: category, $options: 'i' } } })
    }

    if (search) {
      pipeline.push({ $match: { title: { $regex: search, $options: 'i' } } })
    }

    const productList = await productSchema.aggregate(pipeline)
    const totalPages = Math.ceil(totalProducts / limit)

    res.status(200).send({
      message: 'Success',
      productList,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.log(error)
  }
}

// ====== Admin Product List (includes buyPrice + totalStock + profit) — admin only
const getAdminProductList = async (req, res) => {
  try {
    const productList = await productSchema.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category',
        },
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $sort: { createdAt: -1 } },
      {
        $addFields: {
          totalStock: { $sum: '$variants.stock' },
          profitPerUnit: { $subtract: ['$price', '$buyPrice'] },
        },
      },
    ])

    res.status(200).send({ message: 'Success', productList })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server' })
  }
}

// ====== Get Product Details (by slug)
const getProductDetails = async (req, res) => {
  try {
    const { slug } = req.params

    const productDetails = await productSchema.findOne({ slug }).populate('category', 'name').select('-isActive -buyPrice')
    if (!productDetails) return res.status(404).send({ message: 'Product not found' })

    res.status(200).send({ message: 'success', productDetails })
  } catch (error) {
    console.log(error)
  }
}

// ====== Update Product (by slug)
const updateProduct = async (req, res) => {
  try {
    const { title, description, category, price, buyPrice, discountPercentage, variants, tags, isActive } = req.body
    const { slug } = req.params
    const thumbnail = req.files?.thumbnail?.[0]

    const productData = await productSchema.findOne({ slug })
    if (!productData) return responseHandler.error(res, 'Product not found', 404)

    if (title) productData.title = title
    if (description) productData.description = description
    if (category) productData.category = category
    if (price) productData.price = price
    if (buyPrice !== undefined && buyPrice !== '') productData.buyPrice = buyPrice
    if (discountPercentage !== undefined && discountPercentage !== '') productData.discountPercentage = discountPercentage
    if (isActive !== undefined) productData.isActive = isActive
    if (tags && tags.length > 0 && Array.isArray(tags)) productData.tags = tags

    const variantData = variants && JSON.parse(variants)
    if (Array.isArray(variantData) && variantData.length > 0) {
      for (const variant of variantData) {
        if (!variant.sku) return res.status(400).send({ message: 'Sku is required' })
        if (!variant.size) return res.status(400).send({ message: 'Size is required' })
        if (!variant.color) return res.status(400).send({ message: 'Color is required' })
        if (!SIZE_ENUM.includes(variant.size)) return res.status(400).send({ message: 'Invalid size' })
        if (!variant.stock || variant.stock < 1)
          return res.status(400).send({ message: 'Stock is required & must more than 1' })
      }
      const skus = variantData.map((item) => item.sku)
      if (new Set(skus).size !== skus.length) return res.status(400).send({ message: 'Sku must be unique' })
      productData.variants = variantData
    }

    if (thumbnail) {
      const imgRes = await uploadToCloudinary(thumbnail, 'product')
      deleteToCloudinary(productData?.thumbnail, 'product')
      productData.thumbnail = imgRes.secure_url
    }
    await productData.save()
    return responseHandler.success(res, 'Uddate successfully done', productData)
  } catch (error) {
    return responseHandler.error(res, error.message)
  }
}

// ====== Delete Product (by slug)
const deleteProduct = async (req, res) => {
  try {
    const { slug } = req.params
    const productData = await productSchema.findOne({ slug })
    if (!productData) return res.status(404).send({ message: 'Product not found' })

    if (productData.thumbnail) deleteToCloudinary(productData.thumbnail, 'thumbnail')
    for (const img of productData.images || []) {
      deleteToCloudinary(img, 'product')
    }
    await productData.deleteOne()

    res.status(200).send({ message: 'Product deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server' })
  }
}

module.exports = { createProduct, getProductList, getAdminProductList, getProductDetails, updateProduct, deleteProduct }
