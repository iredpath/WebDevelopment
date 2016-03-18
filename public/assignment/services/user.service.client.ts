import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class UserService {

	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
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