import * as mongoose from 'mongoose'

import UserSchema from './user.schema'

export default function() {

	const MovieSchema = new mongoose.Schema({
		imdbId: String,
		title: String,
		image: String, // base64 encoded image, least bad of two bad options
		year: String, // can be single number or range (i.e. 1999-2001)
		libraries: [String], // library _id
		ratings: [String], // ratings _id ?
		comments: [String] // comment _id ?
	}, { collection: 'project.movie' })
	return MovieSchema
}