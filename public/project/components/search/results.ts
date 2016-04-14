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
	totalResults: number
	fetchingResults: boolean
	query: string
	currentPage: number
	lastPage: number
	pages: Array<number>

	constructor(public params: RouteParams, public resultsService: ResultsService, public posterService: PosterService) {
		this.fetchingResults = true
		this.results = {}
		const query: string = params.get('query')
		if (query) {
			this.query = query
			resultsService.getResults(query, null)
				.subscribe(
					resp => {
						const data = resp.json()
						if (data.Response) {
							this.currentPage = 1
							this.totalResults = data.totalResults
							this.lastPage = Math.ceil(this.totalResults / 10)
							this.calculatePages()
							this.results.movies = _.map(data.Search, mov => {
								return OmdbMovieModel.newMovie(mov)
							})
							// let's get some posters
							async.each(this.results.movies, (mov, cb) => {
								this.posterService.getPosterFor((<any>mov).imdbId)
									.subscribe(posterResp => {
										(<any>mov).image = `data:image/png;base64,${posterResp.text()}`
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

	getResultsPage(page: number) {
		this.resultsService.getResults(this.query, page)
			.subscribe(resp => {
				const data = resp.json()
				if (data.Response) {
					this.currentPage = page
					this.calculatePages()
					//this.totalResults = data.totalResults
					this.results.movies = _.map(data.Search, mov => {
						return OmdbMovieModel.newMovie(mov)
					})
					// let's get some posters
					async.each(this.results.movies, (mov, cb) => {
						this.posterService.getPosterFor((<any>mov).imdbId)
							.subscribe(posterResp => {
								(<any>mov).image = `data:image/png;base64,${posterResp.text()}`
								cb(null)
							})
					})
				} else {
					alert(data.Error)
					this.results = {}
				}
			},
			err => { alert(err); this.results = {} },
			() => { this.fetchingResults = false })
	}

	calculatePages() {
		// Show 5 pages
		// When > 5 pages, show [curr - 2, curr + 2]
		const minPage = Math.min(this.lastPage - 4, Math.max(1, this.currentPage - 2))
		const maxPage = Math.min(this.lastPage, Math.max(5, this.currentPage + 2))
		this.pages = _.range(minPage, maxPage + 1)
	}

}