import { Injectable } from 'angular2/core'
import { Http } from 'angular2/http'

@Injectable()
export class OmdbService {
	
	BASE_URL:string = "http://www.omdbapi.com/"
	BASE_POSTER_URL: string = "http://img.omdbapi.com/"
	API_KEY: string

	constructor(public http:Http) {
	}

	findMovieById(id:string) {
		const url:string = `${this.BASE_URL}?i=${id}&r=json&tomatoes=true`
		return this.http.get(url)
	}

	// TODO: pagination for 10+responses
	findMovieBySearch(query: string, page: number) {
		let url: string = `${this.BASE_URL}?s=${query.trim()}&r=json&tomatoes=true`
		if (page) {
			url += `&page=${page}`
		}
		return this.http.get(url)
	}

}