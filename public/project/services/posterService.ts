import { Injectable } from 'angular2/core'
import { Http } from 'angular2/http'

@Injectable()
export class PosterService {

	constructor(public http: Http) {

	}
	getPosterFor(movie: any) {
		return this.http.get(`/api/project/poster/${movie.imdbId}`)
	}

}