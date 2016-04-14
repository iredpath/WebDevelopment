import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class PosterService {
	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	getPosterFor(movie: string) {
		return this.http.get(`/api/project/poster/${movie}`, { headers: this.headers })
	}

}