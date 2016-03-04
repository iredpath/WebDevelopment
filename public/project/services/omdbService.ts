import { Injectable } from 'angular2/core'
import { Http } from 'angular2/http'

@Injectable()
export class OmdbService {
	
	BASE_URL:string = "http://www.omdbapi.com/"

	constructor(public http:Http) {
	}

	findMovieById(id:string) {
		const url:string = `${this.BASE_URL}?i=${id}&r=json&tomatoes=true`
		return this.http.get(url)
	}

	// TODO: pagination for 10+responses
	findMovieBySearch(query:string) {
		const url:string = `${this.BASE_URL}?s=${query}&r=json&tomatoes=true`
		return this.http.get(url)
	}

}