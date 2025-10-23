import { Schema, model, models } from 'mongoose'
import { CategoryBaseType } from '@/types';


const CategorySchema = new Schema<CategoryBaseType & { user: any }>({
    user: {
        type: Schema.Types.ObjectId,
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