import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

import LibrarySchema from './library.schema'
import UserSchema from './user.schema'
import MovieSchema from './movie.schema'
import RatingSchema from './rating.schema'
import CommentSchema from './comment.schema'

export default class RatingModel {

	ratingSchema: any
	commentModel: any
	userModel: any
	movieModel: any
	ratingModel: any
	libraryModel: any

	constructor() {
		this.ratingSchema = RatingSchema()
		this.ratingModel = mongoose.model('Rating', this.ratingSchema)
		this.userModel = mongoose.model('User', UserSchema())
		this.movieModel = mongoose.model('Movie', MovieSchema())
		this.commentModel = mongoose.model('Comment', RatingSchema())
		this.libraryModel = mongoose.model('Library', LibrarySchema())
	}

	createRating(newRating) {
		let deferred = Q.defer()
		this.ratingModel.create(newRating, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findByIdAndUpdate(resp.target, { $push: { ratings: resp._id } }),
					this.movieModel.findByIdAndUpdate(resp.target, { $push: { ratings: resp._id } }),
					this.userModel.findByIdAndUpdate(resp.user, { $push: { ratings: resp._id } })
				]).then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
		})
	}

	deleteComment(id) {
		let deferred = Q.defer()
		this.ratingModel.findByIdAndRemove(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findByIdAndUpdate(resp.target, { $pull: { ratings: id } }),
					this.movieModel.findByIdAndUpdate(resp.target, { $pull: { ratings: id } }),
					this.userModel.findByIdAndUpdate(resp.user, { $pull: { ratings: resp._id } })
				]).then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
		})
	}


}