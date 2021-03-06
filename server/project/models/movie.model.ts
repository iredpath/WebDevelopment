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
			if (err) {
				deferred.reject(err)
			} else {
				deferred.resolve({ movie: resp, libraries: [], ratings: [], comments: [] })
			}
		})
		return deferred.promise
	}

	getAllMovies() {
		let deferred = Q.defer()
		this.movieModel.find({}, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				// PLEASE BE A BETTER WAY TO DO THIS
				const reqList = _.map(resp, movie => {
					return this.getMovieById((<any>movie)._id)
				})
				Q.allSettled(reqList)
					.then(success => {
						// oh boy, here we go
						const response = _.map(success, r => {
							const libraries = (<any>r).value.libraries
							const comments = (<any>r).value.comments
							const ratings = (<any>r).value.ratings
							const movie = (<any>r).value.movie

							// there is literally NO POSSIBLE WAY to modify movie here
							// even if let is used over const
							// so I have to do this idiotic thing in the meantime to overwrite properties
							let movieResp: any = {}
							movieResp.ratings = ratings
							movieResp.comments = comments
							movieResp.libraries = libraries
							// copy over remaining schema props
							movieResp.image = movie.image
							movieResp.title = movie.title
							movieResp.year = movie.year
							movieResp._id = movie._id
							movieResp.imdbId = movie.imdbId

							console.log(movieResp)
							return movieResp
						})
						deferred.resolve(response)
					}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	getMovieById(id: string) {
		let deferred = Q.defer()
		this.movieModel.findById(id, (err, resp) => {
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

	deleteMovie(id: string) {
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


	addMovieToLibrary(movieId, libraryId) {
		let deferred = Q.defer()
		const update = { $push: { libraries: libraryId } }
		this.movieModel.findByIdAndUpdate(movieId, update, { new: true }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const libUpdate = { $push: { movies: movieId } }
				this.libraryModel.findByIdAndUpdate(libraryId, libUpdate, { new: true }, (err, lib) => {
					if (err) {
						deferred.reject(err)
					} else {

						deferred.resolve({ movie: resp, libraries: lib })
					}
				})
			}
		})
		return deferred.promise
	}

	getMovieByImdbId(id: string) {
		let deferred = Q.defer()
		this.movieModel.findOne({ imdbId: id }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else if (!resp) {
				deferred.resolve({ movie: resp })
			} else {
				// get all the stuff we need
				Q.all([
					this.libraryModel.find({ movies: resp._id }),
					this.ratingModel.find({ target: resp._id }),
					this.commentModel.find({ target: resp._id })
				]).then(success => {
					const libraries = success[0]
					const ratings = success[1]
					const comments = success[2]
					deferred.resolve({ movie: resp, libraries, ratings, comments })
				}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}
	getMovie(id: string, title: string) {
		let deferred = Q.defer()
		this.movieModel.findOne({ imdbId: id }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else if (resp) {
				Q.all([
					this.libraryModel.find({ movies: resp._id }),
					this.ratingModel.find({ target: resp._id }),
					this.commentModel.find({ target: resp._id })
				]).then(success => {
					const libraries = success[0]
					const ratings = success[1]
					const comments = success[2]
					deferred.resolve({ movie: resp, libraries, ratings, comments })
				}, error => { deferred.reject(error) })
			} else {
				// create the movie
				this.createMovie({ imdbId: id, title })
					.then(success => { deferred.resolve(success) },
						error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	addCommentToMovie(movieId: string, comment: any) {
		let deferred = Q.defer()
		comment.date = new Date().getTime()
		this.commentModel.create(comment, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				// add comment to relevant user and library
				const update = { $push: { comments: resp._id } }
				Q.all([
					this.userModel.findByIdAndUpdate(comment.userId, update),
					this.libraryModel.findByIdAndUpdate(comment.target, update)
				]).then(success => {
					deferred.resolve(resp)
				}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	editCommentForMovie(movieId: string, commentId: string, commentText: string) {
		let deferred = Q.defer()
		const date = new Date().getTime()
		this.commentModel.findByIdAndUpdate(commentId, { comment: commentText, date, edited: true }, { new: true }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				// add comment to relevant user and library
				const update = { $push: { comments: resp._id } }
				Q.all([
					this.userModel.findByIdAndUpdate(resp.userId, update),
					this.libraryModel.findByIdAndUpdate(resp.target, update)
				]).then(success => {
					deferred.resolve(resp)
				}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

}