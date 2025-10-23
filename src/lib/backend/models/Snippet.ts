import { SnippetBaseType } from '@/types';
import { Schema, model, models } from 'mongoose'

const SnippetSchema = new Schema<SnippetBaseType & { user: any }>({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    // The categoryId from your type definition. For a full implementation,
    // you could create a Category model and reference it here.
    categoryId: {
        type: String,
        required: false,
        trim: true,
    },
    tags: [{
        type: String,
        required: false,
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

export default models.Snippet || model('Snippet', SnippetSchema);