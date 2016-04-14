import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'
import * as bcrypt from 'bcrypt-nodejs'

export default class UserModelProj {

	userSchema: any
	userModel: any

	libraryModel: any
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

	createUser(newUser) {
		let deferred = Q.defer()
		bcrypt.hash(newUser.password, null, null, (err, hash) => {
			if (err) {
				deferred.reject(err)
			} else {
				newUser.password = hash
				this.userModel.create(newUser, (err, resp) => {
					if (err) {
						deferred.reject(err)
					} else {
						deferred.resolve(resp)
					}
				})
			}
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

	getUserById(id: string) {
		let deferred = Q.defer()
		this.userModel.findById(id, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else if (!resp) {
				deferred.reject({ message: "no such user" })
			} else {
				deferred.resolve({ user: resp })
			}
		})
		return deferred.promise
	}

	getUserWithEverythingById(id: string) {
		let deferred = Q.defer()
		this.getUserById(id)
			.then(data => {
				Q.all([
					this.libraryModel.find({ user: id }),
					this.commentModel.find({ userId: id }),
					this.ratingModel.find({ userId: id })
				]).then(response => {
					const libraries = (<any>response[0])
					const comments = (<any>response[1])
					const ratings = (<any>response[2])
					deferred.resolve({ user: (<any>data).user, libraries, comments, ratings })
				}, error => { deferred.reject(error) })
			}, error => { deferred.reject(error) })
		return deferred.promise
	}

	updateUser(what) {
		let deferred = Q.defer()

		bcrypt.hash(what.password, null, null, (err, hash) => {
			if (err) {
				deferred.reject(err)
			} else {
				what.password = hash
				this.userModel.findByIdAndUpdate(what._id, _.omit(what, '_id', 'libraries', 'comments', 'ratings'),
					{ new: true }, (err, resp) => {
						if (err) {
							deferred.reject(err)
						} else {
							this.commentModel.update({ user: resp.id }, { username: resp.username }, { multi: true }, (error, comms) => {
								if (error) {
									deferred.reject(error)
								} else {
									deferred.resolve({ user: resp, comments: comms, ratings: what.ratings, libraries: what.libraries })
								}
							})
						}
					})
			}
		})
		return deferred.promise
	}

	deleteUser(id: string) {
		let deferred = Q.defer()
		this.userModel.findByIdAndRemove(id, (err, resp) => {
			// remove all associated stuff
			if (err) {
				deferred.reject(err)
			} else {
				Q.all([
					this.libraryModel.findAndRemove({ user: id }),
					this.ratingModel.findAndRemove({ userId: id }),
					this.commentModel.findAndRemove({ userId: id })
				]).then(success => {
					// remove everything we just deleted
					const libIds = _.map((<any>success[0]), l => { return (<any>l)._id })
					const ratingIds = _.map((<any>success[1]), r => { return (<any>r)._id })
					const commentIds = _.map((<any>success[1]), c => { return (<any>c)._id })
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
			} else if (!resp) {
				deferred.reject({ message: " no such user" })
			} else {
				Q.all([
					this.libraryModel.find({ user: resp._id }),
					this.commentModel.find({ userId: resp._id }),
					this.ratingModel.find({ userIs: resp._id })
				]).then(response => {
					const libraries = (<any>response[0])
					const comments = (<any>response[1])
					const ratings = (<any>response[2])
					deferred.resolve({ user: resp, libraries, comments, ratings })
				}, error => { deferred.reject(error) })
			}
		})
		return deferred.promise
	}

	getUserByCredentials(username: string, password: string) {
		let deferred = Q.defer()

		this.getUserByUsername(username)
			.then(data => {
				const user = (<any>data).user
				if (!user) {
					deferred.reject('invalid username')
				}
				bcrypt.compare(password, (<any>user).password, (err, res) => {
					if (err) {
						deferred.reject(err)
					} else if (!res) {
						// we may be comparing two encrypted passwords
						if (password === (<any>user).password) {
							deferred.resolve(user)
						} else {
							deferred.reject('invalid password')
						}
					} else {
						deferred.resolve(user)
					}
				})
			}, error => { deferred.reject(error.message) })
		return deferred.promise
	}

}