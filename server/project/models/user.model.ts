import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

import UserSchema from './user.schema'
import LibrarySchema from './library.schema'
import MovieSchema from './movie.schema'
import RatingSchema from './rating.schema'
import CommentSchema from './comment.schema'

export default class UserModelProj {

	userSchema: any
	userModel: any

	libraryModel: any
	movieModel: any
	ratingModel: any
	commentModel: any

	constructor() {
		this.userSchema = UserSchema()
		this.userModel = mongoose.model('User', this.userSchema)
		this.libraryModel = mongoose.model('Library', LibrarySchema())
		this.movieModel = mongoose.model('Movie', MovieSchema())
		this.ratingModel = mongoose.model('Rating', RatingSchema())
		this.commentModel = mongoose.model('Comment', CommentSchema())
	}

	createUser(newUser) {
		let deferred = Q.defer()
		this.userModel.create(newUser, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getAllUsers() {
		let deferred = Q.defer()
		this.userModel.find({}, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getUserById(id: number) {
		let deferred = Q.defer()
		this.userModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				this.libraryModel.find({ user: id }, (error, libs) => {
					if (err) {
						deferred.reject(error)
					} else {
						resp.libraries = libs
						deferred.resolve(resp)
					}
				})
			}
		})
		return deferred.promise
	}

	updateUser(what) {
		let deferred = Q.defer()
		this.userModel.findByIdAndUpdate(what._id, _.omit(what, '_id', 'libraries', 'comments'),
						{ new: true }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				this.commentModel.update({ user: resp.id }, { username: resp.username }, { multi: true }, (error, comms) => {
					error ? deferred.reject(error) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}

	deleteUser(id: number) {
		let deferred = Q.defer()
		this.userModel.findByIdAndRemove(id, (err, resp) => {
			// remove all associated stuff
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findAndRemove({ user: id }),
					this.ratingModel.findAndRemove({ user: id }),
					this.commentModel.findAndRemove({ user: id })
				]).then(success => {
					// remove everything we just deleted
					const libIds = _.map((<any>success[0]).value, l => { return (<any>l)._id })
					const ratingIds = _.map((<any>success[1]).value, r => { return (<any>r)._id })
					const commentIds = _.map((<any>success[1]).value, c => { return (<any>c)._id })
					const movieUpdate = { $pull: { libraries: { $in: libIds },
													ratings: { $in: ratingIds },
													comments: { $in: commentIds }
										} }
					const libUpdate = {
						$pull: {
							ratings: { $in: ratingIds },
							comments: { $in: commentIds }
						}
					}
					Q.all([
						this.movieModel.update({}, movieUpdate, { multi: true }),
						this.libraryModel.update({}, libUpdate, { multi: true })
					]).then(success => { deferred.resolve(resp) }, error => { deferred.reject(error) })
				}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	getUserByUsername(username: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				this.libraryModel.find({ user: resp._id }, (error, libs) => {
					if (err) {
						deferred.reject(error)
					} else {
						resp.libraries = libs
						deferred.resolve(resp)
					}
				})
			}
		})
		return deferred.promise
	}

	getUserByCredentials(username: string, password: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username, password }, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				this.libraryModel.find({ user: resp._id }, (error, libs) => {
					if (err) {
						deferred.reject(error)
					} else {
						resp.libraries = libs
						deferred.resolve(resp)
					}
				})
			}
		})
		return deferred.promise
	}

}