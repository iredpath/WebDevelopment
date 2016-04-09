import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

import LibrarySchema from './library.schema'
import UserSchema from './user.schema'
import MovieSchema from './movie.schema'
import RatingSchema from './rating.schema'
import CommentSchema from './comment.schema'

export default class LibraryModel {

	librarySchema: any
	libraryModel: any
	userModel: any
	movieModel: any
	ratingModel: any
	commentModel: any

	constructor() {
		this.librarySchema = LibrarySchema()
		this.libraryModel = mongoose.model('Library', this.librarySchema)
		this.userModel = mongoose.model('User', UserSchema())
		this.movieModel = mongoose.model('Movie', MovieSchema())
		this.ratingModel = mongoose.model('Rating', RatingSchema())
		this.commentModel = mongoose.model('Comment', CommentSchema())
	}

	createLibrary(newLibrary) {
		let deferred = Q.defer()
		this.libraryModel.create(newLibrary, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const userId = newLibrary.user
				const update = { $push: { libraries: resp._id } }
				this.userModel.findByIdAndUpdate(userId, update, { new: true }, (error, user) => {
					err ? deferred.reject(err) : deferred.resolve(resp) // stil want to just send the lib back
				})
			}
		})
		return deferred.promise
	}

	getAllLibraries() {
		let deferred = Q.defer()
		this.libraryModel.find({}, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getLibraryById(id: number) {
		let deferred = Q.defer()
		this.libraryModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const userId = resp.user
				Q.all([
					this.userModel.findById(userId),
					this.movieModel.find({libraries: id}),
					this.ratingModel.find({ target: id }),
					this.commentModel.find({ target: id })
				])
					.then(success => {
						resp.userObject = success[0]
						resp.movieObjects = success[1]
						resp.ratingObjects = success[2]
						resp.commentObjects = success[3]
						deferred.resolve(resp)
					}, error => { deferred.reject(error)})
			}
		})
		return deferred.promise
	}

	updateLibrary(what) {
		let deferred = Q.defer()
		this.libraryModel.findByIdAndUpdate(what._id, 
						_.omit(what, '_id', 'user', 'movies', 'ratings', 'comments'),
						{ new: true },
						(err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	deleteLibrary(id: number) {
		let deferred = Q.defer()
		this.libraryModel.findByIdAndRemove(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const userId = resp.user
				const update = { $pull: { libraries: resp._id } }
				Q.all([
					this.userModel.findByIdAndUpdate(userId, update, { new: true }),
					this.movieModel.findAndUpdate({}, update, { new: true }),
					this.ratingModel.findAndRemove({ target: id }),
					this.commentModel.findAndRemove({ target: id })
				])
					.then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
			return deferred.promise
		})
	}

	deleteMovieFromLibrary(movieId: string, libraryId: string) {
		let deferred = Q.defer()
		const update = { $pull: { movies: movieId } }
		this.libraryModel.findByIdAndUpdate(libraryId, update, { new: true }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const movieUpdate = { $pull: { libraries: libraryId } }
				this.movieModel.findByIdAndUpdate(movieId, movieUpdate, { new: true }, (err, movie) => {
					err ? deferred.reject(err) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}

}