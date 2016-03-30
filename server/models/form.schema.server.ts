import * as mongoose from 'mongoose'
import FieldSchema from './field.schema.server'

export default function() {

	const FormSchema = new mongoose.Schema({
		userId: String,
		title: { type: String, default: "New Form" },
		fields: { type: [FieldSchema()], default: [] },
		created: { type: Date, default: Date.now() },
		updated: { type: Date, default: Date.now() }
	}, { collection: 'assignment.form' })
	return FormSchema
}