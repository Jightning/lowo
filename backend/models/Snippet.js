const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    dateCreated: {
        type: String,
        required: true,
        trim: false,
    },
    dateUpdated: {
        type: String,
        required: false,
        trim: false,
    },
    // The categoryId from your type definition. For a full implementation,
    // you could create a Category model and reference it here.
    categoryId: {
        type: String,
        trim: true,
    },
    tags: [{
        type: String,
        trim: true,
    }],
    content: {
        type: {
            type: String,
            enum: ['text', 'code', 'image'],
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        language: {
            type: String,
            default: 'plaintext',
        },
    },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

module.exports = mongoose.model('Snippet', SnippetSchema);