import mongoose from 'mongoose'

const connection: { isConnected?: number } = {}

export async function dbConnect() {
    if (connection.isConnected) {
        return
    }
    const MONGO_URI = process.env.MONGO_URI
    if (!MONGO_URI) {
        console.error("NO URI Present")
        return
    }

    const db = await mongoose.connect(MONGO_URI)

    connection.isConnected = db.connections[0].readyState;
}