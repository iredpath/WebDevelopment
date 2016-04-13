import * as mongoose from 'mongoose'

export default function() {

	const UserSchema = new mongoose.Schema({
		username: String,
		password: String,
		firstname: String,
		lastname: String,
		email: String,
		phones: [String],
		role: String
	}, { collection: 'assignment.user' })
	return UserSchema
}