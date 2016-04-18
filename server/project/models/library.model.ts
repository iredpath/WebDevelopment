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
			if (err) {
				deferred.reject(err)
			} else {
				console.log(resp)
				// PLEASE BE A BETTER WAY TO DO THIS
				const reqList = _.map(resp, library => {
					return this.getLibraryById((<any>library)._id)
				})
				Q.allSettled(reqList)
					.then(success => {
						// oh boy, here we go
						console.log(success)
						const response = _.map(success, r => {

							const library = (<any>r).value.library
							const movies = (<any>r).value.movies
							const user = (<any>r).value.user
							const comments = (<any>r).value.comments
							const ratings = (<any>r).value.ratings
							// there is literally NO POSSIBLE WAY to modify movie here
							// even if let is used over const
							// so I have to do this idiotic thing in the meantime to overwrite properties

							let libraryResp: any = {}
							libraryResp.movies = movies
							libraryResp.user = user
							libraryResp.comments = comments
							libraryResp.ratings = ratings
							// copy over remainig schema props
							libraryResp._id = library._id
							libraryResp.name = library.name

							return libraryResp
						})
						console.log(response)
						deferred.resolve(response)
					}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	getLibrariesForUser(id: string) {
		let deferred = Q.defer()
		this.libraryModel.find({ user: id }, (err, libs) => {
			err ? deferred.reject(err) : deferred.resolve(libs)
		})
		return deferred.promise
	}

	getLibraryById(id: string) {
		let deferred = Q.defer()
		this.libraryModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				const userId = resp.user
				Q.all([
					this.userModel.findById(userId),
					this.movieModel.find({ libraries: id }),
					this.ratingModel.find({ target: id }),
					this.commentModel.find({ target: id })
				])
					.then(success => {
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

	deleteLibrary(id: string) {
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

	addCommentToLibrary(libId: string, comment: any) {
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

	editCommentForLibrary(libId: string, commentId: string, commentText: string) {
		let deferred = Q.defer()
		const date = new Date().getTime()
		this.commentModel.findByIdAndUpdate(commentId, { comment: commentText, date }, { new: true }, (err, resp) => {
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