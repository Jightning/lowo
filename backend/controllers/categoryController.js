const Category = require('../models/Category');

// @desc    Get all categories for the logged-in user
// @route   GET /api/categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user.id }).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new category
// @route   POST /api/categories
exports.createCategory = async (req, res) => {
    const { id, name, description, dateCreated, dateUpdated, color, icon } = req.body;

    try {
        const newCategory = new Category({
            user: req.user.id,
            id,
            name,
            description,
            dateCreated,
            dateUpdated,
            color,
            icon,
        });

        const category = await newCategory.save();
        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a category
// @route   PUT /api/categories/:id
exports.updateCategory = async (req, res) => {
    const { id, name, description, dateCreated, dateUpdated, color, icon } = req.body;

    try {
        let category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ msg: 'Category not found' });

        // Make sure user owns the category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        category = await Category.findByIdAndUpdate(
            req.params.id,
            { $set: { id, name, description, dateCreated, dateUpdated, color, icon } },
            { new: true }
        );

        res.json(category);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a category
// @route   DELETE /api/categories/:id
exports.deleteCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) return res.status(404).json({ msg: 'Category not found' });

        // Make sure user owns the category
        if (category.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Category.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Category removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};