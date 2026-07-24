const express = require('express')
const multer = require('multer')
const {
  createProduct,
  getProductList,
  getAdminProductList,
  getProductDetails,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

const upload = multer()
const route = express.Router()

route.post(
  '/create',
  authMiddleware,
  roleCheckMiddleware('admin', 'editor'),
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
  createProduct
)
route.get('/allproducts', getProductList)
route.get('/admin/list', authMiddleware, roleCheckMiddleware('admin', 'editor'), getAdminProductList)
route.get('/:slug', getProductDetails)
route.put(
  '/updateproduct/:slug',
  authMiddleware,
  roleCheckMiddleware('admin', 'editor'),
  upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 4 }]),
  updateProduct
)
route.delete('/deleteproduct/:slug', authMiddleware, roleCheckMiddleware('admin'), deleteProduct)

module.exports = route
