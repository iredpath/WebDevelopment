import { View, Component } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { LibraryService } from '../../services/libraryService'
import { MovieService } from '../../services/movieService'

@Component({
	selector: "vml-home"
})
@View({
	templateUrl: "/project/components/home/home.view.html",
	directives: [RouterLink]
})

export class Home {
	fetchingLibraries: boolean
	fetchingMovies: boolean
	libraries: Array<any>
	movies: Array<any>

	constructor(public libraryService: LibraryService, public movieService: MovieService) {
		this.fetchingLibraries = true
		this.fetchingMovies = true
		libraryService.getAll()
			.subscribe(resp => {
				if (resp.json().libraries) {
					this.libraries = resp.json().libraries
				} else {
					alert('error fetching libraries')
					this.libraries = []
				}
				this.fetchingLibraries = false
				movieService.getAll()
					.subscribe(resp => {
						if (resp.json().movies) {
							this.movies = resp.json().movies
						} else {
							alert('error fetching all movies')
							this.movies = []
						}
						this.fetchingMovies = false
					})
			})
	}

	getRandomMovies() {
		return _.sampleSize(this.movies, 10)
	}

	getRandomLibraries() {
		return _.sampleSize(this.libraries, 10)
	}

	getAvgRating(ratings: Array<any>) {
		console.log(ratings)
		return _.reduce(ratings, (acc, rat) => { return acc + (<any>rat).value }, 0) / Math.max(ratings.length, 1)
		//console.log(rat)
		//return rat
	}

}