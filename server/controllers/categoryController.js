const categorySchema = require('../models/categorySchema')
const { uploadToCloudinary, deleteToCloudinary } = require('../utils/cloudinaryService')

// ====== Create Category (single image: thumbnail)
const createCategory = async (req, res) => {
  try {
    const { name, slug, description } = req.body
    const thumbnail = req.file
    if (!name) return res.status(400).send({ message: 'Category name is required' })
    if (!slug) return res.status(400).send({ message: 'Category slug is required' })
    if (!thumbnail) return res.status(400).send({ message: 'Thumbnail is requred' })

    const existCateSlug = await categorySchema.findOne({ slug })
    if (existCateSlug) return res.status(400).send({ message: 'Category name is already exist' })

    const imgRes = await uploadToCloudinary(thumbnail, 'categories')

    const category = categorySchema({
      name,
      slug,
      description,
      thumbnail: imgRes.secure_url,
    })
    category.save()

    res.status(201).send({ message: 'Successful' })
  } catch (error) {
    console.log(error)
  }
}

// ====== Get All Categories
const getAllCategory = async (req, res) => {
  try {
    const categories = await categorySchema.find({})

    res.status(200).send({ message: 'Successfully get', categories })
  } catch (error) {
    console.log(error)
  }
}

// ====== Update Category
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    const { id } = req.params
    const thumbnail = req.file

    const category = await categorySchema.findById(id)
    if (!category) return res.status(404).send({ message: 'Category not found' })

    if (name) category.name = name
    if (description !== undefined) category.description = description

    if (thumbnail) {
      const imgRes = await uploadToCloudinary(thumbnail, 'categories')
      if (category.thumbnail) {
        await deleteToCloudinary(category.thumbnail, 'categories')
      }
      category.thumbnail = imgRes.secure_url
    }

    await category.save()
    res.status(200).send({ message: 'Category updated successfully', category })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

// ====== Delete Category
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params
    const category = await categorySchema.findById(id)
    if (!category) return res.status(404).send({ message: 'Category not found' })

    if (category.thumbnail) await deleteToCloudinary(category.thumbnail, 'categories')
    await category.deleteOne()

    res.status(200).send({ message: 'Category deleted successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).send({ message: 'Internal server error' })
  }
}

module.exports = { createCategory, getAllCategory, updateCategory, deleteCategory }
