import * as mongoose from 'mongoose'

import UserSchema from './user.schema'

export default function() {

	const MovieSchema = new mongoose.Schema({
		imdbId: String,
		title: String,
		libraries: [String], // library _id
		ratings: [String], // ratings _id ?
		comments: [String] // comment _id ?
	}, { collection: 'project.movie' })
	return MovieSchema
}