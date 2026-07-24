const express = require('express')
const multer = require('multer')
const {
  createCategory,
  getAllCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController')
const { authMiddleware } = require('../middleware/authMiddleware')
const roleCheckMiddleware = require('../middleware/roleCheckMiddleware')

const route = express.Router()
const upload = multer()

route.post('/create', authMiddleware, roleCheckMiddleware('admin'), upload.single('thumbnail'), createCategory)
route.get('/allcategories', getAllCategory)
route.put('/update/:id', authMiddleware, roleCheckMiddleware('admin'), upload.single('thumbnail'), updateCategory)
route.delete('/delete/:id', authMiddleware, roleCheckMiddleware('admin'), deleteCategory)

module.exports = route
