const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: false,
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
    color: {
        type: String,
        default: '#808080', // Default to gray
    },
    icon: {
        type: String,
        default: '',
    },
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);