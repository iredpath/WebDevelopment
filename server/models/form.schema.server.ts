import * as mongoose from 'mongoose'

export default function() {

	const FormSchema = new mongoose.Schema({
		username: String,
		password: String,
		firstName: String,
		lastName: String,
		email: String,
		phones: [String]
	}, { collection: 'assignment.form' })
	return FormSchema
}