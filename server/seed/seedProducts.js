require('dotenv').config()
const mongoose = require('mongoose')
const categorySchema = require('../models/categorySchema')
const productSchema = require('../models/productSchema')

// Hosted image URLs so the storefront works before any Cloudinary upload.
const categoriesData = [
  { name: 'OUTERWEAR', slug: 'outerwear', description: 'Coats, bombers & trenches — the archive layer.', thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=400&auto=format&fit=crop' },
  { name: 'BOTTOMS', slug: 'bottoms', description: 'Tailored trousers, cargos & wide-leg silhouettes.', thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=400&auto=format&fit=crop' },
  { name: 'KNITWEAR', slug: 'knitwear', description: 'Cashmere, ribbed vests & structured knits.', thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=400&auto=format&fit=crop' },
  { name: 'SHIRTS', slug: 'shirts', description: 'Overshirts & utility layering pieces.', thumbnail: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop' },
]

// products keyed by category slug; SKUs are globally unique
const buildProducts = (catMap) => [
  {
    title: 'LGS REVERSIBLE BOMBER', slug: 'lgs-reversible-bomber', description: 'Cocoon-cut wool blend, reversible satin lining and a tonal embroidered crest.',
    category: catMap.outerwear, price: 1100, buyPrice: 620, discountPercentage: 18, tags: ['bomber', 'wool'],
    thumbnail: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop'],
    variants: [{ sku: 'BMB-001-S', size: 'S', color: 'Noir', stock: 8 }, { sku: 'BMB-001-M', size: 'M', color: 'Noir', stock: 12 }, { sku: 'BMB-001-L', size: 'L', color: 'Noir', stock: 6 }],
    isActive: true,
  },
  {
    title: 'WIDE LEG TAILORED PANTS', slug: 'wide-leg-tailored-pants', description: 'Fluid wide-leg trouser in structured monochrome twill with pressed pleats.',
    category: catMap.bottoms, price: 289, buyPrice: 150, discountPercentage: 15, tags: ['trouser'],
    thumbnail: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'PNT-014-M', size: 'M', color: 'Charcoal', stock: 20 }, { sku: 'PNT-014-L', size: 'L', color: 'Charcoal', stock: 22 }],
    isActive: true,
  },
  {
    title: 'CASHMERE RIBBED TANK TOP', slug: 'cashmere-ribbed-tank', description: 'Second-skin ribbed tank spun from pure cashmere.',
    category: catMap.knitwear, price: 149, buyPrice: 70, discountPercentage: 0, tags: ['cashmere'],
    thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'TNK-007-S', size: 'S', color: 'Cream', stock: 0 }, { sku: 'TNK-007-M', size: 'M', color: 'Cream', stock: 4 }],
    isActive: true,
  },
  {
    title: 'RELAXED NOIR CARGO PANTS', slug: 'relaxed-noir-cargo', description: 'Relaxed cargo with bellowed pockets and a tapered ankle in noir cotton drill.',
    category: catMap.bottoms, price: 259, buyPrice: 128, discountPercentage: 15, tags: ['cargo'],
    thumbnail: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'CRG-021-M', size: 'M', color: 'Noir', stock: 30 }, { sku: 'CRG-021-L', size: 'L', color: 'Noir', stock: 33 }],
    isActive: true,
  },
  {
    title: 'OVERSIZED TRENCH COAT', slug: 'oversized-trench-coat', description: 'Voluminous trench with dropped shoulder, storm flap and detachable belt.',
    category: catMap.outerwear, price: 649, buyPrice: 340, discountPercentage: 15, tags: ['trench'],
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'TRC-003-M', size: 'M', color: 'Sand', stock: 5 }, { sku: 'TRC-003-L', size: 'L', color: 'Sand', stock: 3 }],
    isActive: true,
  },
  {
    title: 'STRUCTURED KNIT VEST', slug: 'structured-knit-vest', description: 'Firm-gauge knit vest holding its architectural shape.',
    category: catMap.knitwear, price: 169, buyPrice: 82, discountPercentage: 12, tags: ['vest'],
    thumbnail: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'VST-009-M', size: 'M', color: 'Slate', stock: 0 }, { sku: 'VST-009-L', size: 'L', color: 'Slate', stock: 0 }],
    isActive: true,
  },
  {
    title: 'TACTICAL CARGO SHIRT', slug: 'tactical-cargo-shirt', description: 'Overshirt with utility pockets and a boxy cut in cotton canvas.',
    category: catMap.shirts, price: 239, buyPrice: 115, discountPercentage: 0, tags: ['overshirt'],
    thumbnail: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    images: [],
    variants: [{ sku: 'SHT-012-M', size: 'M', color: 'Olive', stock: 27 }, { sku: 'SHT-012-L', size: 'L', color: 'Olive', stock: 18 }],
    isActive: true,
  },
]

// ====== Seed runner
const seed = async () => {
  try {
    await mongoose.connect(process.env.DB_STRING)
    console.log('DB Connected!')

    await productSchema.deleteMany({})
    await categorySchema.deleteMany({})
    console.log('Cleared existing products & categories.')

    const insertedCats = await categorySchema.insertMany(categoriesData)
    const catMap = insertedCats.reduce((acc, c) => ({ ...acc, [c.slug]: c._id }), {})
    console.log(`Seeded ${insertedCats.length} categories.`)

    const products = buildProducts(catMap)
    const insertedProducts = await productSchema.insertMany(products)
    console.log(`Seeded ${insertedProducts.length} products successfully ✅`)
  } catch (error) {
    console.log('Seed error:', error)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

seed()
