const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} = require('../controllers/categoryController');

// All routes here are protected by the auth middleware
router.use(auth);

// Route for getting all categories and creating a new one
router.route('/')
    .get(getCategories)
    .post(createCategory);

// Route for updating and deleting a specific category by its ID
router.route('/:id')
    .put(updateCategory)
    .delete(deleteCategory);

module.exports = router;