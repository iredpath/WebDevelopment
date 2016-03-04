import { Injectable } from 'angular2/core'
import { LibraryModel } from '../models/libraryModel'

@Injectable()
export class LibraryService {

	libraries: Object

	constructor() {
		this.libraries = {}
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
		})
	}

	get(id: number) {
		return this.libraries[id]
	}

	addLibrary(library: LibraryModel) {
		this.libraries[library.id] = library
	}

	getAll() {
		return <Array<LibraryModel>> _.values(this.libraries)
	}

	getLibrariesWith(id: string): Array<LibraryModel> {
		return _.filter(<Array<LibraryModel>> _.values(this.libraries), lib => {
			return _.some(lib.movies, movie => {
				return movie.imdbId === id
			})
		})
	}


}