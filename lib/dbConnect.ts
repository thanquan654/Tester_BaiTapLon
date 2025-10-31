import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

async function dbConnect() {
	if (!MONGODB_URI) {
		throw new Error(
			'Please define the MONGODB_URI environment variable inside .env.local',
		)
	}

	if (mongoose.connection.readyState === 0) {
		console.log(
			'Mongoose is currently disconnected. Attempting to connect...',
		)
		mongoose
			.connect(MONGODB_URI)
			.then(() => console.log('MongoDB Connected'))
			.catch((err) => console.error('MongoDB Connection Error:', err))
	} else if (mongoose.connection.readyState === 1) {
		console.log('Mongoose is already connected.')
	} else if (mongoose.connection.readyState === 2) {
		console.log('Mongoose is currently connecting...')
	} else if (mongoose.connection.readyState === 3) {
		console.log('Mongoose is currently disconnecting.')
	}
}

export default dbConnect
