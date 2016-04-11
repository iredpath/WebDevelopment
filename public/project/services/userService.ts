import { Http, Headers } from 'angular2/http'

import { Injectable } from 'angular2/core'
import { UserModel } from '../models/userModel'
import { MovieModel } from '../models/movieModel'
import { LibraryModel } from '../models/LibraryModel'
import { LibraryService } from '../services/libraryService'
import { MovieService } from '../services/movieService'

@Injectable()
export class UserService {

	activeUser: any
	headers

	constructor(public libraryService: LibraryService, public movieService: MovieService, public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	findUserByCredentials(username: string, password: string) {//, callback: Function) {
		return this.http.get(`/api/project/user?username=${username}&password=${password}`,
			{ headers: this.headers })
	}

	findAllUsers(callback) {
		return this.http.get('/api/project/user',
			{ headers: this.headers })
	}

	createUser(user) {
		return this.http.post('/api/project/user', JSON.stringify({ user }),
			{ headers: this.headers })
	}

	login(user: UserModel) {
		this.activeUser = user
	}
	logout() {
		this.activeUser = null
	}
	getActiveUser() {
		return this.activeUser
	}
	getUserById(id: string) {
		return this.http.get(`/api/project/user/${id}`,
			{ headers: this.headers })
	}

	updateUser(user: any) {
		return this.http.put('/api/project/user', JSON.stringify({ user }), { headers: this.headers })
	}
}