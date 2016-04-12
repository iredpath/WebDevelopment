import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class UserService {

	headers
	activeUser: any

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
		this.activeUser = null
	}

	setActiveUser(user) {
		console.log(user)
		this.activeUser = user
	}

	getActiveUser() { return this.activeUser }

	isActiveUser() { return !!this.activeUser }

	isActiveAdminUser() { return this.activeUser && _.includes(this.activeUser.roles, 'admin') }

	clearActiveUser() { this.activeUser = null }

	login(username: string, password: string) {
		return this.http.post('/api/assignment/login', JSON.stringify({ username, password }),
			{ headers: this.headers })
	}

	loggedIn() {
		return this.http.get('/api/assignment/loggedin')
	}

	logout() {
		return this.http.post('/api/assignment/logout', '')
	}

	findUserByCredentials(username: string, password: string) {
		return this.http.get(`/api/assignment/user?username=${username}&password=${password}`)
	}

	findAllUsers() {
		return this.http.get("/api/assignment/user")
	}

	createUser(user) {
		return this.http.post("/api/assignment/user", JSON.stringify({ user }),
			{ headers: this.headers })
	}

	deleteUserById(userId) {
		return this.http.delete(`/api/assignment/user/${userId}`)
	}

	updateUser(userId, user) {
		return this.http.put(`/api/assignment/user/${userId}`, JSON.stringify({ user }),
			{ headers: this.headers })
	}
}