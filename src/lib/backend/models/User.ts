import { Schema, model, models } from 'mongoose'

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
}, { timestamps: true });

export default models.User || model('User', UserSchema);