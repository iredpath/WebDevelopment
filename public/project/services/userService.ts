import { Http, Headers } from 'angular2/http'

import { Injectable } from 'angular2/core'
import { LibraryModel } from '../models/LibraryModel'
import { LibraryService } from '../services/libraryService'
import { MovieService } from '../services/movieService'

@Injectable()
export class UserService {

	activeUser: any
	headers

	setActiveUser(user) {
		console.log(user)
		this.activeUser = user
	}

	getActiveUser() { return this.activeUser }

	isActiveUser() { return !!this.activeUser }

	clearActiveUser() { this.activeUser = null }

	hasEditRights(id: string) {
		return this.isActiveUser() && this.getActiveUser()._id === id
	}

	login(username: string, password: string) {
		return this.http.post('/api/project/login', JSON.stringify({ username, password }),
			{ headers: this.headers })
	}

	loggedIn() {
		return this.http.get('/api/project/loggedin')
	}

	logout() {
		return this.http.post('/api/project/logout', '')
	}

	constructor(public libraryService: LibraryService, public movieService: MovieService, public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	findUserByCredentials(username: string, password: string) {
		return this.http.get(`/api/project/user?username=${username}&password=${password}`,
			{ headers: this.headers })
	}

	findAllUsers() {
		return this.http.get('/api/project/user',
			{ headers: this.headers })
	}

	createUser(user) {
		return this.http.post('/api/project/user', JSON.stringify({ user }),
			{ headers: this.headers })
	}

	
	getUserById(id: string) {
		return this.http.get(`/api/project/user/${id}`,
			{ headers: this.headers })
	}

	updateUser(user: any) {
		return this.http.put('/api/project/user', JSON.stringify({ user }), { headers: this.headers })
	}
}