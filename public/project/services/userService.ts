import { Injectable } from 'angular2/core'
import { UserModel } from '../models/userModel'
import { MovieModel } from '../models/movieModel'
import { LibraryModel } from '../models/LibraryModel'
import { LibraryService } from '../services/libraryService'
import { MovieService } from '../services/movieService'

@Injectable()
export class UserService {

	users: Object
	activeUser: UserModel

	constructor(public libraryService: LibraryService, public movieService: MovieService) {
		this.users = {}
		this.activeUser = null
		const userData = [
			{ "_id": 123, "firstname": "Alice", "lastname": "Wonderland", "username": "alice", "password": "alice",
				libraries: [{
					id: 1, name: "sample1", movies: [{ id: 1, imdbId: "tt0120338", title: "Titanic" }],
					comments: [], ratings: [], user: { username: "alice", id: 123 }
				},
			{
				id: 2, name: "sample2", movies: [
					{ id: 2, imdbId: "tt0096895", title: "Batman" },
					{ id: 3, imdbId: "tt1431045", title: "Deadpool" }],
				comments: [], ratings: [], user: { username: "alice", id: 123 }
			}] },
			{ "_id": 234, "firstname": "Bob", "lastname": "Hope", "username": "bob", "password": "bob",
				libraries: [{
					id: 3, name: "sample3", movies: [
						{ id: 1, imdbId: "tt0120338", title: "Titanic" },
						{ id: 3, imdbId: "tt1431045", title: "Deadpool" }],
					comments: [], ratings: [], user: { username: "bob", id: 234 }
				}]
			},
			{ "_id": 345, "firstname": "Charlie", "lastname": "Brown", "username": "charlie", "password": "charlie" },
			{ "_id": 456, "firstname": "Dan", "lastname": "Craig", "username": "dan", "password": "dan" },
			{ "_id": 567, "firstname": "Edward", "lastname": "Norton", "username": "ed", "password": "ed"}
		]
		// Create users based on userData
		_.forEach(userData, (data) => {
			let user: UserModel = UserModel.newUser(data)
			this.users[user.id] = user
		})
	}

	findUserByCredentials(username: string, password: string, callback: Function) {
		let user: UserModel
		for (user of <Array<UserModel>> _.values(this.users)) {
			if (user.username === username && user.password === password) {
				callback(user)
				return
			}
		}
		callback(null)
	}

	findAllUsers(callback) {
		callback(_.values(this.users))
	}

	createUser(user, callback) {
		user.id = (new Date).getTime()
		// ensure unique username
		if (user.username && !this.duplicateUsername(user.username)) {
			this.users[user.id] = user
			callback(user)
		} else {
			callback(null)
		}
	}

	duplicateUsername(name) {
		return _.some(<Array<UserModel>> _.values(this.users), user => {
			return user.username === name
		})
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
	get(id: number) {
		return this.users[id]
	}

	addMovie(movie: MovieModel) {
		if(this.activeUser.libraries.length > 0) {
			this.activeUser.libraries[0].movies.push(movie)
			this.addLibrary(this.activeUser.libraries[0])
		}
	}

	addLibrary(library: LibraryModel) {
		if (this.activeUser) {
			this.users[this.activeUser.id].libraries.push(library)
			this.libraryService.addLibrary(library)
		}
	}

}