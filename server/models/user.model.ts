import * as mongoose from 'mongoose'
import * as Q from 'q'

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
		this.userModel.create(newUser, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
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
		this.userModel.findByIdAndUpdate(id, what, { new: true }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
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

	findUserByCredentials(username: string, password: string) {
		let deferred = Q.defer()
		this.userModel.findOne({ username, password }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}
}