import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class PosterService {
	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	getPosterFor(movie: any) {
		return this.http.get(`/api/project/poster/${movie.imdbId}`, { headers: this.headers })
	}

}