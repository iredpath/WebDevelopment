import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

import LibrarySchema from './library.schema'
import UserSchema from './user.schema'
import MovieSchema from './movie.schema'
import RatingSchema from './rating.schema'
import CommentSchema from './comment.schema'

export default class CommentModel {

	commentSchema: any
	commentModel: any
	userModel: any
	movieModel: any
	ratingModel: any
	libraryModel: any

	constructor() {
		this.commentSchema = CommentSchema()
		this.commentModel = mongoose.model('Comment', this.commentSchema)
		this.userModel = mongoose.model('User', UserSchema())
		this.movieModel = mongoose.model('Movie', MovieSchema())
		this.ratingModel = mongoose.model('Rating', RatingSchema())
		this.libraryModel = mongoose.model('Library', LibrarySchema())
	}

	createComment(newComment) {
		let deferred = Q.defer()
		this.commentModel.create(newComment, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findByIdAndUpdate(resp.target, { $push: { comments: resp._id } }),
					this.movieModel.findByIdAndUpdate(resp.target, { $push: { comments: resp._id } }),
					this.userModel.findByIdAndUpdate(resp.user, { $push: { comments: resp._id } })
				]).then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
		})
	}

	deleteComment(id) {
		let deferred = Q.defer()
		this.commentModel.findByIdAndRemove(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findByIdAndUpdate(resp.target, { $pull: { comments: id } }),
					this.movieModel.findByIdAndUpdate(resp.target, { $pull: { comments: id } }),
					this.userModel.findByIdAndUpdate(resp.user, { $pull: { comments: resp._id } })
				]).then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
		})
	}


}