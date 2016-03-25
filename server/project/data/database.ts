import * as _ from 'lodash'

export default class Database {

	users: Array<any>
	movies: Array<any>
	libraries: Array<any>
	randomId: number

	constructor() {
		this.randomId = 12314
		this.users = require('./mockUsers.json')
		this.movies = require('./mockMovies.json')
		this.libraries = require('./mockLibraries.json')
	}

	getAllUsers() {
		return this.users
	}

	getUserById(id: string) {
		return _.find(this.users, user => { return user._id.toString() === id })
	}

	getUserByUsername(username: string) {
		return _.find(this.users, user => { return user.username === username })
	}

	getUserByCredentials(username: string, password: string) {
		return _.find(this.users, user => {
			return user.username === username && user.password === password
		})
	}

	createUser(user) {
		user._id = (this.randomId++).toString()
		if(_.find(this.users, u => { return u.username === user.username })) {
			return { error: "duplicate username!" }
		}
		this.users.push(user)
		return user
	}

	updateUser(user) {
		_.forEach(this.users, u => {
			if(u._id === user._id) {
				u = user
			}
		})
		return user
	}

	deleteUser(id: string) {
		const removed = _.find(this.users, user => { return user._id === id })
		_.remove(this.users, user => { return user._id === id })
		return removed
	}

	deleteLibraryForUser(libraryId: string, userId: string) {
		_.remove(this.libraries, lib => { return lib.id.toString() === libraryId })
		console.log(this.libraries)
		let user = _.find(this.users, user => { return user._id.toString() === userId })
		_.remove(user.libraries, lib => { return (<any>lib).id.toString() === libraryId })
		console.log(user)
		_.forEach(this.movies, movie => {
			_.remove(movie.libraries, lib => { return (<any>lib).id.toString() === libraryId })
		})
		console.log(this.movies)
		return user
	}

	getAllLibraries() {
		return this.libraries
	}

	getLibraryById(id: string) {
		return _.find(this.libraries, lib => { return lib.id.toString() === id })
	}

	createLibrary(library) {
		library.id = (this.randomId++).toString()
		this.libraries.push(library)
		const user = library.user
		_.find(this.users, u => { return u._id === user.id }).libraries.push(library)
		return library
	}

	updateLibrary(library) {
		this.libraries = _.map(this.libraries, lib => {
			if (lib.id === library.id) {
				return library
			}
			return lib
		})
		_.forEach(this.movies, movie => {
			movie.libraries = _.map(movie.libraries, lib => {
				if ((<any>lib).id === library.id) {
					return library
				}
				return lib
			})
		})

		_.forEach(this.users, user => {
			user.libraries = _.map(user.libraries, lib => {
				if ((<any>lib).id === library.id) {
					return library
				}
				return lib
			})
		})
		return library
	}

	deleteLibrary(id: string) {
		const removed = _.find(this.libraries, lib => { return lib.id === id })
		_.remove(this.libraries, lib => { return lib.id === id })
		_.forEach(this.users, user => {
			_.remove(user.libraries, lib => { return (<any>lib).id === id })
		})
		_.forEach(this.movies, movie => {
			_.remove(movie.libraries, lib => { return (<any>lib).id === id })
		})
		return removed
	}

	getAllMovies() {
		return this.movies
	}

	getMovieById(id: string) {
		return _.find(this.movies, movie => { return movie.imdbId === id })
	}

	createMovie(movie) {
		movie.id = (this.randomId++).toString()
		this.movies.push(movie)
		return movie
	}

	updateMovie(movie) {
		_.forEach(this.movies, mov => {
			if (mov.id === movie.id) {
				mov = movie
			}
		})
		return movie
	}

	updateMovieLibrary(movie, libraryId) {
		if (_.find(movie.libraries, lib => { return (<any>lib).id === libraryId })) {
			return movie
		}
		let retVal
		_.forEach(this.movies, mov => {
			if (mov.id === movie.id) {
				mov.libraries.push(libraryId)
				retVal = mov
			}
		})
		return retVal
	}

	deleteMovie(id: string) {
		const removed = _.find(this.movies, movie => { return movie.id === id })
		_.remove(this.movies, movie => { return movie.id === id })
		return removed
	}

	deleteMovieFromLibrary(movieId: string, libraryId: string) {
		let library = _.find(this.libraries, lib => { return lib.id === libraryId })
		_.remove(library.movies, mov => { return (<any>mov).id === movieId })
		return library
	}
}
