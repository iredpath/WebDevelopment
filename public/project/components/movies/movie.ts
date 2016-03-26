import { View, Component, Inject } from 'angular2/core'
import { RouteParams, RouterLink } from 'angular2/router'
import { MovieModel } from '../../models/movieModel'
import { OmdbMovieModel } from '../../models/omdbMovieModel'
import { LibraryModel } from '../../models/libraryModel'
import { OmdbService } from '../../services/omdbService'
import { MovieService } from '../../services/movieService'
import { LibraryService } from '../../services/libraryService'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-movies"
})
@View({
	templateUrl: "/project/components/movies/movie.view.html",
	directives: [RouterLink]
})

export class Movie {

	movie: any
	omdbMovie:OmdbMovieModel
	fetchingMovie:boolean
	fetchingLibraries: boolean
	libraryId: string

	constructor(public params:RouteParams, public omdbService:OmdbService,
		public movieService: MovieService, public libraryService: LibraryService,
		public userService: UserService) {
		this.fetchingMovie = true
		this.fetchingLibraries = true
		const imdbId: string = params.get('movie')
		omdbService.findMovieById(imdbId)
			.subscribe(
				data => { 
					this.omdbMovie = OmdbMovieModel.newMovie(data.json())
					movieService.getOrCreate(imdbId, this.omdbMovie.title)
						.subscribe(resp => {
							if (resp.json().movie) {
								this.movie = resp.json().movie
							} else {
								console.log('error fetching movie')
							}
							this.fetchingLibraries = false
						})
				},
				err => { alert(err); this.omdbMovie = OmdbMovieModel.emptyMovie() },
				() => { this.fetchingMovie = false }
			)
	}
	// eventually, this will be part of a new component and logic will be moved out of here
	addMovie() {
		if (this.libraryId) {
			this.movieService.addMovieToLibrary(this.movie, this.libraryId)
				.subscribe(resp => {
					if (resp.json().movie) {
						this.movie = resp.json().movie
					}
				})
		} else {
			alert("please select a library first")
		}

	}
}