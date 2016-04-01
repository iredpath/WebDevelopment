import * as mongoose from 'mongoose'

export default function() {

	const UserSchema = new mongoose.Schema({
		username: String,
		password: String,
		firstName: String,
		lastName: String,
		email: String,
		phones: [String]
	}, { collection: 'assignment.user' })
	return UserSchema
}