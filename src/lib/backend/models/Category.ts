import { Schema, model, models } from 'mongoose'
import { Category } from '@/types';


const CategorySchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // id: {
    //     type: String,
    //     required: true,
    //     trim: true,
    // },
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



export default models.Category || model('Category', CategorySchema);