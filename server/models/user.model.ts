import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'
import * as bcrypt from 'bcrypt-nodejs'

import UserSchema from './user.schema.server'
export default class UserModel {

	db: any
	userSchema: any
	userModel: any

	constructor(db) {
		this.userSchema = UserSchema()
		this.userModel = mongoose.model('User', this.userSchema)
	}

	create(newUser) {
		let deferred = Q.defer()
		// encrypt password before creating

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

	findAll() {
		let deferred = Q.defer()
		this.userModel.find({}, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findById(id: number) {
		let deferred = Q.defer()
		this.userModel.findById(id, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	update(id: number, what) {
		let deferred = Q.defer()
		// encrypt password before creating
		bcrypt.hash(what.password, null, null, (err, hash) => {
			if (err) {
				deferred.reject(err)
			} else {
				what.password = hash
				this.userModel.findByIdAndUpdate(id, _.omit(what, '_id'), { new: true }, (err, resp) => {
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

	delete(id: number) {
		let deferred = Q.defer()
		this.userModel.findByIdAndRemove(id, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findUserByUsername(username: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findUserByEncryptedCredentials(username: string, password: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username, password }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findUserByCredentials(username: string, password: string) {
		let deferred = Q.defer()
		this.findUserByUsername(username)
			.then(user => {
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