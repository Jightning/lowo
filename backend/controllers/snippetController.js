const Snippet = require('../models/Snippet');

// @desc    Get all snippets for the logged-in user
// @route   GET /api/snippets
exports.getSnippets = async (req, res) => {
    try {
        const snippets = await Snippet.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(snippets);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Create a new snippet
// @route   POST /api/snippets
exports.createSnippet = async (req, res) => {
    const { title, dateCreated, dateUpdated, categoryId, tags, content } = req.body;

    try {
        const newSnippet = new Snippet({
            user: req.user.id,
            title,
            dateCreated,
            dateUpdated,
            categoryId,
            tags,
            content,
        });

        const snippet = await newSnippet.save();
        res.json(snippet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update a snippet
// @route   PUT /api/snippets/:id
exports.updateSnippet = async (req, res) => {
    const { title, dateCreated, dateUpdated, categoryId, tags, content } = req.body;

    try {
        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) return res.status(404).json({ msg: 'Snippet not found' });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });c
        }

        snippet = await Snippet.findByIdAndUpdate(
            req.params.id,
            { $set: { title, dateCreated, dateUpdated, categoryId, tags, content } },
            { new: true }
        );

        res.json(snippet);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Delete a snippet
// @route   DELETE /api/snippets/:id
exports.deleteSnippet = async (req, res) => {
    try {
        let snippet = await Snippet.findById(req.params.id);

        if (!snippet) return res.status(404).json({ msg: 'Snippet not found' });

        // Make sure user owns the snippet
        if (snippet.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'Not authorized' });
        }

        await Snippet.findByIdAndDelete(req.params.id);

        res.json({ msg: 'Snippet removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};