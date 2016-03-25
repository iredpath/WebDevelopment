import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'
import { LibraryModel } from '../models/libraryModel'

@Injectable()
export class LibraryService {

	libraries: Object
	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
		/*this.libraries = {}
		const sampleLibraryData = [
			{
				id: 1, name: "sample1", movies: [{ id: 1, imdbId: "tt0120338", title: "Titanic" }],
				comments: [], ratings: [], user: { username: "alice", id: 123 }
			},
			{
				id: 2, name: "sample2", movies: [
					{ id: 2, imdbId: "tt0096895", title: "Batman" },
					{ id: 3, imdbId: "tt1431045", title: "Deadpool" }],
				comments: [], ratings: [], user: { username: "alice", id: 123 }
			},
			{
				id: 3, name: "sample3", movies: [
					{ id: 1, imdbId: "tt0120338", title: "Titanic" },
					{ id: 3, imdbId: "tt1431045", title: "Deadpool" }],
				comments: [], ratings: [], user: { username: "bob", id: 234 }
			}
		]
		_.forEach(sampleLibraryData, lib => {
			let model: LibraryModel = LibraryModel.newLibrary(lib)
			this.libraries[model.id] = model
		})*/
	}

	get(id: number) {
		return this.http.get(`/api/project/library/${id}`,
			{ headers: this.headers })
		//return this.libraries[id]
	}

	addLibrary(library: LibraryModel) {
		return this.http.post('/api/project/library', JSON.stringify({ library }),
			{ headers: this.headers })
		//this.libraries[library.id] = library
	}

	getAll() {
		return this.http.get('/api/project/library',
			{ headers: this.headers })
		//return <Array<LibraryModel>> _.values(this.libraries)
	}

	getLibrariesWith(id: string): Array<LibraryModel> {
		return _.filter(<Array<LibraryModel>> _.values(this.libraries), lib => {
			return _.some(lib.movies, movie => {
				return movie.imdbId === id
			})
		})
	}

	updateLibrary(library) {
		return this.http.put('/api/project/library', JSON.stringify({ library}), { headers: this.headers })
	}

	removeLibrary(id: number) {
		return this.http.delete(`/api/project/library/${id}`,
			{ headers: this.headers })
		//delete this.libraries[id]
	}

	removeMovie(libraryId: number, movieId: string) {
		return this.http.delete(`/api/project/library/${libraryId}/movie/${movieId}`,
			{ headers: this.headers })
	}

}