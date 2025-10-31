import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please provide a name.'],
		},
		email: {
			type: String,
			required: [true, 'Please provide an email.'],
			unique: true,
			match: [/.+\@.+\..+/, 'Please fill a valid email address'],
		},
		password: {
			type: String,
			required: [true, 'Please provide a password.'],
		},
	},
	{
		timestamps: true,
	},
)

// Tránh việc định nghĩa lại model khi hot-reload trong môi trường dev
export default mongoose.models.User || mongoose.model('User', UserSchema)
