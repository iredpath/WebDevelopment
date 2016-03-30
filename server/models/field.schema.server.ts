import * as mongoose from 'mongoose'

export default function() {

	const FieldSchema = new mongoose.Schema({
		username: String,
		password: String,
		firstName: String,
		lastName: String,
		email: String,
		roles: [String],
		phones: [String]
	}, { collection: 'assignment.field' })
	return FieldSchema
}