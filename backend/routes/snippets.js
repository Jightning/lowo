const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
    getSnippets,
    createSnippet,
    updateSnippet,
    deleteSnippet,
} = require('../controllers/snippetController');

// All routes here are protected
router.use(auth);

router.route('/')
    .get(getSnippets)
    .post(createSnippet);

router.route('/:id')
    .put(updateSnippet)
    .delete(deleteSnippet);

module.exports = router;