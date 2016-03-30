import * as mongoose from 'mongoose'
import FieldSchema from './field.schema.server'

export default function() {

	const FormSchema = new mongoose.Schema({
		userId: String,
		title: String,
		fields: [FieldSchema()],
		created: Date,
		updated: Date
	}, { collection: 'assignment.form' })
	return FormSchema
}