import productJacket from '../assets/images/product_jacket.png'
import productPants from '../assets/images/product_pants.png'
import productTank from '../assets/images/product_tank.png'
import productCargo from '../assets/images/product_cargo.png'
import heroImg from '../assets/images/hero.png'
import collectionImg from '../assets/images/collection.png'

// ====== Central Product Data ======
// Single source of truth — used by NewArrivals, FeaturedProducts,
// ProductDetails, Cart & Checkout. Pass slices of this via props.
export const products = [
  {
    id: 1,
    slug: 'lgs-reversible-bomber',
    name: 'LGS REVERSIBLE BOMBER',
    category: 'OUTERWEAR',
    price: 1100,
    oldPrice: 1350,
    discount: '20% OFF',
    image: productJacket,
    hoverImage: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
    gallery: [
      productJacket,
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Constructed in cocoon-cut wool blend and finished in a sculpted noir silhouette. A reversible archive piece, hand-finished with a satin lining and a tonal embroidered crest.',
    details: [
      '100% Italian wool blend outer',
      'Reversible satin inner shell',
      'Rib-knit collar, cuffs & hem',
      'Dry clean only',
    ],
    isNew: true,
    featured: true,
  },
  {
    id: 2,
    slug: 'wide-leg-tailored-pants',
    name: 'WIDE LEG TAILORED PANTS',
    category: 'BOTTOMS',
    price: 289,
    oldPrice: 340,
    discount: 'SPECIAL',
    image: productPants,
    hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    gallery: [
      productPants,
      'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: ['28', '30', '32', '34', '36'],
    description:
      'A fluid wide-leg trouser cut from structured monochrome twill. Pressed pleats fall into a clean column for an elongated, editorial line.',
    details: ['Structured twill', 'Pressed front pleat', 'Hidden hook closure', 'Machine wash cold'],
    featured: true,
  },
  {
    id: 3,
    slug: 'cashmere-ribbed-tank',
    name: 'CASHMERE RIBBED TANK TOP',
    category: 'KNITWEAR',
    price: 149,
    image: productTank,
    hoverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
    gallery: [
      productTank,
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'A second-skin ribbed tank spun from pure cashmere. Weightless, breathable and cut close to layer under tailoring.',
    details: ['100% grade-A cashmere', 'Ribbed body', 'Raw-edge armholes', 'Hand wash'],
    featured: true,
  },
  {
    id: 4,
    slug: 'relaxed-noir-cargo',
    name: 'RELAXED NOIR CARGO PANTS',
    category: 'BOTTOMS',
    price: 259,
    oldPrice: 320,
    discount: 'HOT 15%',
    image: productCargo,
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
    gallery: [
      productCargo,
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Utility reworked in luxe proportions. A relaxed cargo with bellowed pockets and a tapered ankle in a deep noir cotton drill.',
    details: ['Heavyweight cotton drill', 'Bellowed side pockets', 'Tapered ankle', 'Machine wash cold'],
    featured: true,
  },
  {
    id: 5,
    slug: 'oversized-trench-coat',
    name: 'OVERSIZED TRENCH COAT',
    category: 'OUTERWEAR',
    price: 649,
    oldPrice: 749,
    discount: 'NEW 15%',
    image: productJacket,
    hoverImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    gallery: [
      productJacket,
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'A voluminous trench with a dropped shoulder and storm flap, belted at the waist. Water-resistant gabardine built for the archive.',
    details: ['Water-resistant gabardine', 'Detachable belt', 'Storm flap & epaulettes', 'Dry clean only'],
    isNew: true,
  },
  {
    id: 6,
    slug: 'tailored-monochrome-trouser',
    name: 'TAILORED MONOCHROME TROUSER',
    category: 'BOTTOMS',
    price: 219,
    image: productPants,
    hoverImage: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
    gallery: [productPants],
    sizes: ['28', '30', '32', '34'],
    description:
      'A slim, straight-leg trouser in a single monochrome tone. Cut for a sharp, minimal daily uniform.',
    details: ['Wool-touch weave', 'Straight leg', 'Zip fly', 'Machine wash cold'],
    isNew: true,
  },
  {
    id: 7,
    slug: 'structured-knit-vest',
    name: 'STRUCTURED KNIT VEST',
    category: 'KNITWEAR',
    price: 169,
    oldPrice: 199,
    discount: 'LIMITED',
    image: productTank,
    hoverImage: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800&auto=format&fit=crop',
    gallery: [productTank],
    sizes: ['S', 'M', 'L'],
    description:
      'A structured knit vest with a firm gauge, holding its architectural shape. Layer over tailoring or wear alone.',
    details: ['Firm-gauge knit', 'V-neckline', 'Ribbed trims', 'Hand wash'],
    isNew: true,
  },
  {
    id: 8,
    slug: 'tactical-cargo-shirt',
    name: 'TACTICAL CARGO SHIRT',
    category: 'SHIRTS',
    price: 239,
    image: productCargo,
    hoverImage: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?q=80&w=800&auto=format&fit=crop',
    gallery: [productCargo, heroImg, collectionImg],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'An overshirt built with utility pockets and a boxy cut. Wear open as a light layer or buttoned as a statement.',
    details: ['Cotton canvas', 'Four utility pockets', 'Boxy fit', 'Machine wash cold'],
    isNew: true,
  },
]

// ====== Selectors (defensive reads everywhere) ======
export const getNewArrivals = () => products.filter((p) => p?.isNew).slice(0, 4)
export const getFeatured = () => products.filter((p) => p?.featured).slice(0, 4)
export const getProductBySlug = (slug) => products.find((p) => p?.slug === slug)
export const getRelated = (slug, category) =>
  products.filter((p) => p?.slug !== slug && p?.category === category).slice(0, 4)

// ====== Currency helper ======
export const formatPrice = (value) =>
  `$${Number(value || 0).toLocaleString('en-US', { minimumFractionDigits: 0 })}`
