import * as mongoose from 'mongoose'

export default function() {

	const UserSchema = new mongoose.Schema({
		username: String,
		password: String,
		firstName: String,
		lastName: String,
		email: String,
		phone: String,
		libraries: [String], // library _id
		ratings: [String], // rating _id ?
		comments: [String]
	}, { collection: 'project.user' })
	return UserSchema
}