import * as mongoose from 'mongoose'

export default function() {

	const FieldSchema = new mongoose.Schema({
		label: String,
		type: String,
		placeholder: String,
		options: [Object]
	}, { collection: 'assignment.field' })
	return FieldSchema
}
