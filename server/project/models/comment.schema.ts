import * as mongoose from 'mongoose'

export default function() {

	const CommentSchema = new mongoose.Schema({
		userId: String,
		username: String,
		comment: String,
		target: String, // movie _id or library _id
		date: Number, // numerical date object
		edited: Boolean // has it been edited?
	}, { collection: 'project.comment' })
	return CommentSchema
}