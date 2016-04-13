import { View, Component, Inject } from 'angular2/core'
import { Router, RouterLink, RouteParams } from 'angular2/router'
import { ResultsService } from '../../services/resultsService'
import { PosterService } from '../../services/posterService'
import { OmdbMovieModel } from '../../models/omdbMovieModel'
//import * as async from 'async'

@Component({
	selector: "vml-results"
})

@View({
	templateUrl: "/project/components/search/results.view.html",
	directives: [RouterLink]
})

export class Results {

	results: any
	fetchingResults: boolean

	constructor(public params: RouteParams, public resultsService: ResultsService, public posterService: PosterService) {
		this.fetchingResults = true
		this.results = {}
		const query: string = params.get('query')
		if (query) {
			resultsService.getResults(query)
				.subscribe(
					resp => {
						const data = resp.json()
						if (data.Response) {
							this.results.movies = _.map(data.Search, mov => {
								return OmdbMovieModel.newMovie(mov)
							})
							// let's get some poster
							async.each(this.results.movies, (mov, cb) => {
								//console.log(mov)
								this.posterService.getPosterFor(mov)
									.subscribe(posterResp => {
										(<any>mov).image = `url(data:image/png;base64,${posterResp.json()})`
										cb(null)
									})
							})
						} else {
							alert(data.Error)
							this.results = {}
						} 
					},
					err => { alert(err); this.results = {} },
					() => { this.fetchingResults = false }
				)
		} else {
			this.results = {}
			this.fetchingResults = false
		}
	}

}