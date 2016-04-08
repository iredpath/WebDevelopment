import * as mongoose from 'mongoose'
import * as Q from 'q'
import * as _ from 'lodash'

import UserSchema from './user.schema'
export default class UserModel {

	userSchema: any
	userModel: any

	constructor() {
		this.userSchema = UserSchema()
		this.userModel = mongoose.model('User', this.userSchema)
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
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	updateUser(what) {
		let deferred = Q.defer()
		this.userModel.findByIdAndUpdate(what._id, _.omit(what, '_id'), { new: true }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	deleteUser(id: number) {
		let deferred = Q.defer()
		this.userModel.findByIdAndRemove(id, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getUserByUsername(username: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getUserByCredentials(username: string, password: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username, password }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

}