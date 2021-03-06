import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class AdminService {

	headers
	activeUser: any

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	findAllUsers() {
		return this.http.get("/api/assignment/admin/user")
	}

	createUser(user) {
		return this.http.post("/api/assignment/admin/user", JSON.stringify({ user }),
			{ headers: this.headers })
	}

	deleteUserById(userId) {
		return this.http.delete(`/api/assignment/admin/user/${userId}`)
	}

	updateUser(userId, user) {
		return this.http.put(`/api/assignment/admin/user/${userId}`, JSON.stringify({ user }),
			{ headers: this.headers })
	}
}