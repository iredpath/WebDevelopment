import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

export default class CommentModel {

	commentSchema: any
	commentModel: any
	userModel: any
	movieModel: any
	ratingModel: any
	libraryModel: any

	constructor(userModel, libraryModel, movieModel, ratingModel, commentModel) {
		this.userModel = userModel
		this.libraryModel = libraryModel
		this.movieModel = movieModel
		this.ratingModel = ratingModel
		this.commentModel = commentModel
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