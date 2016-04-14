import { Injectable } from 'angular2/core'
import { Http } from 'angular2/http'
import { OmdbService } from './omdbService'

@Injectable()
export class ResultsService {

	query: string
	constructor(public http:Http, public omdbService: OmdbService) {
		this.query = ""
	}

	getResults(query: string, page: number) {
		return this.omdbService.findMovieBySearch(query, page)
	}

	getQuery() {
		return this.query
	}
}