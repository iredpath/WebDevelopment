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

	createMovie(newMovie) {
		let deferred = Q.defer()
		this.movieModel.create(newMovie, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getAllMovies() {
		let deferred = Q.defer()
		this.movieModel.find({}, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getMovieById(id: number) {
		let deferred = Q.defer()
		this.libraryModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.find({ movies: id }),
					this.ratingModel.find({ target: id }),
					this.commentModel.find({ target: id })
				])
					.then(success => {
						const libraries = success[0]
						const ratings = success[1]
						const comments = success[2]
						deferred.resolve({ movie: resp, libraries, ratings, comments })
					}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	updateMovie(what) {
		let deferred = Q.defer()
		this.movieModel.findByIdAndUpdate(what._id,
			_.omit(what, '_id', 'libraries', 'ratings', 'comments'),
			{ new: true },
			(err, resp) => {
				err ? deferred.reject(err) : deferred.resolve(resp)
			})
		return deferred.promise
	}

	deleteMovie(id: number) {
		let deferred = Q.defer()
		this.movieModel.findByIdAndRemove(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const update = { $pull: { libraries: resp._id } }
				Q.all([
					this.libraryModel.update({}, update, { new: true }),
					this.ratingModel.remove({ target: id }),
					this.commentModel.remove({ target: id })
				])
					.then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
			}
			return deferred.promise
		})
	}


	addMovieToLibrary(movie, libraryId) {
		let deferred = Q.defer()
		const update = { $push: { libraries: libraryId } }
		this.movieModel.findByIdAndUpdate(movie._id, update, { new: true }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const libUpdate = { $push: { movies: movie._id } }
				this.libraryModel.findByIdAndUpdate(libraryId, libUpdate, { new: true }, (err, lib) => {
					if (err) {
						deferred.reject(err)
					} else {
						deferred.resolve(resp) // just want the movie back
					}
				})
			}
		})
		return deferred.promise
	}

	getMovie(id: string, title: string) {
		let deferred = Q.defer()
		this.movieModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else if (resp) {
				deferred.resolve(resp)
			} else {
				// create the movie
				this.createMovie({ imdbId: id, title })
					.then(success => { deferred.resolve(success) },
						error => { deferred.reject(error) })
			}
		})
	}

}