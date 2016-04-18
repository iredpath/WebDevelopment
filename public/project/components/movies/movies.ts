import { View, Component, Inject } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { MovieService } from '../../services/movieService'
import { OmdbService } from '../../services/omdbService'
import { PosterService } from '../../services/posterService'
import { OmdbMovieModel } from '../../models/omdbMovieModel'

@Component({
	selector: "vml-movies"
})
@View({
	templateUrl: "/project/components/movies/movies.view.html",
	directives: [RouterLink]
})

export class Movies {

	movies: Array<any>
	fetchingMovies: boolean
	fetchingResults: boolean

	mostLibsMovies: Array<any>
	highestRatedMovies: Array<any>
	mostCommentsMovies: Array<any>
	fetchingUsers: boolean
	showSearchResults: boolean
	results: Array<any>
	currentPage: number
	lastPage: number
	pages: Array<number>
	query: string

	constructor(public movieService: MovieService, public omdbService: OmdbService,
		public posterService: PosterService) {

		this.fetchingMovies = true
		this.movieService.getAll()
			.subscribe(resp => {
				if (resp.json().movies) {
					this.movies = resp.json().movies
					this.highestRatedMovies = this.calculateHighestRatedMovies()
					this.mostCommentsMovies = this.calculateMostCommentsMovies()
					this.mostLibsMovies = this.calculateMostLibsMovies()
				} else {
					alert('error fetching all movies')
				}
				this.fetchingMovies = false
				this.showSearchResults = false
				this.query = ""
			})
	}

	calculateHighestRatedMovies() {
		return _.sortBy(this.movies, movie => {
			return -1 * this.getAvgRating((<any>movie).ratings)
		})
	}
	calculateMostCommentsMovies() {
		return _.sortBy(this.movies, movie => {
			return -movie.comments.length
		})
	}
	calculateMostLibsMovies() {
		return _.sortBy(this.movies, movie => {
			return -movie.libraries.length
		})
	}

	search() {
		this.omdbService.findMovieBySearch(this.query, null)
			.subscribe(
			resp => {
				const data = resp.json()
				if (data.Response) {
					this.currentPage = 1
					this.lastPage = Math.ceil(data.totalResults / 10)
					this.calculatePages()
					this.results = _.map(data.Search, mov => {
						return OmdbMovieModel.newMovie(mov)
					})
					// let's get some posters
					async.each(this.results, (mov, cb) => {
						this.posterService.getPosterFor((<any>mov).imdbId)
							.subscribe(posterResp => {
								(<any>mov).image = `data:image/png;base64,${posterResp.text()}`
								cb(null)
							})
					})
				} else {
					alert(data.Error)
					this.results = []
				}
			},
			err => { alert(err); this.results = [] },
			() => {
			 this.fetchingResults = false
			 this.showSearchResults = true
			}
			)

	}
	calculatePages() {
		// Show 5 pages
		// When > 5 pages, show [curr - 2, curr + 2]
		const minPage = Math.max(1, Math.min(this.lastPage - 4, this.currentPage - 2))
		const maxPage = Math.min(this.lastPage, Math.max(5, this.currentPage + 2))
		this.pages = _.range(minPage, maxPage + 1)
	}

	getResultsPage(page: number) {
		this.fetchingResults = true
		this.omdbService.findMovieBySearch(this.query, page)
			.subscribe(resp => {
				const data = resp.json()
				if (data.Response) {
					this.currentPage = page
					this.calculatePages()
					//this.totalResults = data.totalResults
					this.results = _.map(data.Search, mov => {
						return OmdbMovieModel.newMovie(mov)
					})
					// let's get some posters
					async.each(this.results, (mov, cb) => {
						this.posterService.getPosterFor((<any>mov).imdbId)
							.subscribe(posterResp => {
								(<any>mov).image = `data:image/png;base64,${posterResp.text()}`
								cb(null)
							})
					})
				} else {
					alert(data.Error)
					this.results = []
				}
			},
			err => { alert(err); this.results = [] },
			() => { this.fetchingResults = false })
	}

	getAvgRating(ratings: Array<any>) {
		console.log(ratings)
		return _.reduce(ratings, (acc, rat) => { return acc + (<any>rat).value }, 0) / Math.max(ratings.length, 1)
		//console.log(rat)
		//return rat
	}
}