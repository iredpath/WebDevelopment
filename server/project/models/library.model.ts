import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

export default class LibraryModel {

	librarySchema: any
	libraryModel: any
	userModel: any
	movieModel: any
	ratingModel: any
	commentModel: any

	constructor(userModel, libraryModel, movieModel, ratingModel, commentModel) {
		this.userModel = userModel
		this.libraryModel = libraryModel
		this.movieModel = movieModel
		this.ratingModel = ratingModel
		this.commentModel = commentModel
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
						console.log(success)
						const user = (<any>success[0])
						const movies = (<any>success[1])
						const ratings = (<any>success[2])
						const comments = (<any>success[3])
						deferred.resolve({ library: resp, user, movies, ratings, comments })
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
					this.movieModel.update({}, update, { new: true }),
					this.ratingModel.remove({ target: id }),
					this.commentModel.remove({ target: id })
				])
					.then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
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