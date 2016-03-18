import * as _ from 'lodash'
export default class UserModel {

	users: Array<any>

	constructor() {
		this.users = require('./user.mock.json').users
	}

	create(newUser) {
		this.users.push(newUser)
		return this.users
	}

	findAll() {
		return this.users
	}

	findById(id: number) {
		return _.find(this.users, user => { return user.id === id })
	}

	update(id: number, what) {
		_.forEach(this.users, user => {
			if (user.id === id) {
				user = what
			}
		})
		return this.users
	}

	delete(id: number) {
		return _.remove(this.users, user => { return user.id === id })
	}

	findUserByUsername(username: string) {
		return _.find(this.users, user => { return user.username === username })
	}

	findUserByCredentials(username: string, password: string) {
		return _.find(this.users, user => { return user.username === username && user.password === password })
	}
}