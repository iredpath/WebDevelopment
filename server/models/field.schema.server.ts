import * as mongoose from 'mongoose'

export default function() {

	const FieldSchema = new mongoose.Schema({
		label: String,
		type: { type: String, enum: ['TEXT', 'TEXTAREA', 'EMAIL', 'PASSWORD', 'RADIOS', 'CHECKBOXES', 'OPTIONS', 'DATE'] },
		placeholder: String,
		options: [{ label: String, value: String }]
	}, { collection: 'assignment.field' })
	return FieldSchema
}
