import { View, Component, Inject } from 'angular2/core'
import { Router, RouterLink, RouteParams } from 'angular2/router'
import { ResultsService } from '../../services/resultsService'
import { OmdbMovieModel } from '../../models/omdbMovieModel'

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

	constructor(public params: RouteParams, public resultsService: ResultsService) {
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