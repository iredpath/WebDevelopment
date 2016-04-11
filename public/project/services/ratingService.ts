import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'

@Injectable()
export class RatingService {

	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}
	createRating(rating: any) {
		return this.http.post(`/api/project/rating`, JSON.stringify({ rating }),
			{ headers: this.headers })
	}
	updateRating(ratingId: string, rating: number) {
		return this.http.put(`/api/project/rating/${ratingId}`, JSON.stringify({ rating }),
			{ headers: this.headers })
	}
	deleteRating(ratingId: string) {
		return this.http.delete(`/api/project/rating/${ratingId}`, { headers: this.headers })
	}
}