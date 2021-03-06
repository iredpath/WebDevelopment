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
	}

	get(id: string) {
		return this.http.get(`/api/project/library/${id}`,
			{ headers: this.headers })
	}

	addLibrary(library: any) {
		return this.http.post('/api/project/library', JSON.stringify({ library }),
			{ headers: this.headers })
	}

	getAll() {
		return this.http.get('/api/project/library',
			{ headers: this.headers })
	}

	updateLibrary(library) {
		return this.http.put('/api/project/library', JSON.stringify({ library}), { headers: this.headers })
	}

	removeLibrary(id: string) {
		return this.http.delete(`/api/project/library/${id}`,
			{ headers: this.headers })
	}

	removeMovieFromLibrary(libraryId: string, movieId: string) {
		return this.http.delete(`/api/project/library/${libraryId}/movie/${movieId}`,
			{ headers: this.headers })
	}

	addCommentToLibrary(libraryId: string, comment: any) {
		return this.http.post(`/api/project/library/${libraryId}/comment`, JSON.stringify({ comment }),
			{ headers: this.headers })
	}

	editCommentForLibrary(libraryId: string, commentId: string, commentText: string) {
		return this.http.put(`/api/project/library/${libraryId}/comment/${commentId}`, JSON.stringify({ commentText }),
			{ headers: this.headers })
	}

	getLibrariesForUser(id: string) {
		return this.http.get(`/api/project/user/${id}/library`)
	}

}