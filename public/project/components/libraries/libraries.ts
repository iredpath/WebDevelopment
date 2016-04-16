import { View, Component } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { LibraryModel } from '../../models/libraryModel'
import { LibraryService } from '../../services/libraryService'

@Component({
	selector: "vml-libraries"
})
@View({
	templateUrl: "/project/components/libraries/libraries.view.html",
	directives: [RouterLink]
})

export class Libraries {
	fetchingLibraries: boolean
	libraries: Array<LibraryModel>

	mostMoviesLibs: Array<any>
	highestRatedLibs: Array<any>
	mostCommentsLibs: Array<any>
	fetchingUsers: boolean
	showSearchResults: boolean
	results: Array<any>
	currentPage: number
	lastPage: number
	pages: Array<number>
	query: string

	constructor(public libraryService: LibraryService) {
		this.fetchingLibraries = true
		libraryService.getAll()
			.subscribe(resp => {
				if (resp.json().libraries) {
					this.libraries = resp.json().libraries
					this.highestRatedLibs = this.calculateHighestRatedLibs()
					this.mostCommentsLibs = this.calculateMostCommentsLibs()
					this.mostMoviesLibs = this.calculateMostMoviesLibs()
				}
				this.fetchingLibraries = false
				this.showSearchResults = false
				this.query = ""
			})

	}

	calculateHighestRatedLibs() {
		return _.sortBy(this.libraries, lib => {
			return - this.getAvgRating((<any>lib).ratings)
		})
	}
	calculateMostCommentsLibs() {
		return _.sortBy(this.libraries, lib => {
			return -lib.comments.length
		})
	}
	calculateMostMoviesLibs() {
		return _.sortBy(this.libraries, lib => {
			return -lib.movies.length
		})
	}

	search() {
		// bit of a misnomer, search is really more of a filter
		this.results = _.filter(this.libraries, lib => {
			return lib.name && lib.name.indexOf(this.query) >= 0
				|| lib.user && lib.user.username && lib.user.username.indexOf(this.query) >= 0
				|| lib.movies && _.some(lib.movies, movie => {
					return movie.title && movie.title.indexOf(this.query) >= 0
				})

		})
		this.currentPage = 1
		this.lastPage = Math.ceil(this.results.length / 10)
		this.calculatePages()
		this.showSearchResults = true
	}
	calculatePages() {
		// Show 5 pages
		// When > 5 pages, show [curr - 2, curr + 2]
		const minPage = Math.max(1, Math.min(this.lastPage - 4, this.currentPage - 2))
		const maxPage = Math.min(this.lastPage, Math.max(5, this.currentPage + 2))
		this.pages = _.range(minPage, maxPage + 1)
	}

	getShownResults() {
		const start = 10 * (this.currentPage - 1)
		return this.results.slice(start, start + 10)
	}
	getResultsPage(page: number) {
		this.currentPage = page
	}
	getAvgRating(ratings: Array<any>) {
		console.log(ratings)
		return _.reduce(ratings, (acc, rat) => { return acc + (<any>rat).value }, 0) / Math.max(ratings.length, 1)
		//console.log(rat)
		//return rat
	}


}