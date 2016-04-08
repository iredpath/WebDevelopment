import * as mongoose from 'mongoose'

export default function() {

	const RatingSchema = new mongoose.Schema({
		value: Number,
		user: String, // user _id
		target: String // movie _id || library _id (rating doesn't care which)
	}, { collection: 'project.rating' })
	return RatingSchema
}