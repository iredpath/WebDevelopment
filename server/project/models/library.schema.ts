import * as mongoose from 'mongoose'

export default function() {

	const LibrarySchema = new mongoose.Schema({
		name: String,
		movies: [String], // movie _id
		user: String, // user _id
		ratings: [String], // ratings _id ?
		comments: [String] // comment _id ?
	}, { collection: 'project.library' })
	return LibrarySchema
}
