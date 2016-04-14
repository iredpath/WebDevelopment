import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class MovieService {

	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	get(id: string) {
		return this.http.get(`/api/project/movie/${id}`,
			{ headers: this.headers })
	}
	getAll() {
		return this.http.get('/api/project/movie',
			{ headers: this.headers })
	}
	addMovie(movie: any) {
		return this.http.post('/api/project/movie', JSON.stringify({ movie }),
			{ headers: this.headers })
	}

	getMoviesForUser(id: string) {
		return this.http.get(`/api/project/movie?user=${id}`,
			{ headers: this.headers })
	}

	addMovieToLibrary(movie: string, libId: string) {
		return this.http.put('/api/project/movie', JSON.stringify({ library: libId, movie }),
			{ headers: this.headers })
	}

	getMovieByImdbId(imdbId: string) {
		return this.http.get(`/api/project/movie?imdbId=${imdbId}`, { headers: this.headers })
	}
/*
	getOrCreate(imdbid: string, title: string) {
		return this.http.post(`/api/project/movie?id=${imdbid}&title=${title}&`, { headers: this.headers })
	}
*/
}