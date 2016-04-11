import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

export default class RatingModel {

	ratingSchema: any
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
		return deferred.promise
	}

	updateRating(ratingId: string, newRating: number) {
		let deferred = Q.defer()
		this.ratingModel.findByIdAndUpdate(ratingId, { value: newRating }, { new: true }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	deleteRating(id) {
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
		return deferred.promise
	}

}