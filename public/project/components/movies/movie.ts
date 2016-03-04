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

	movie:OmdbMovieModel
	libraries: Array<LibraryModel>
	fetchingMovie:boolean
	fetchingLibraries: boolean

	constructor(public params:RouteParams, public omdbService:OmdbService,
		public movieService: MovieService, public libraryService: LibraryService,
		public userService: UserService) {
		this.fetchingMovie = true
		this.fetchingLibraries = true
		//const id: number = +params.get('movie')
		//const localMovie: MovieModel = movieService.get(id)
		const imdbId: string = params.get('movie')//localMovie.imdbId
		omdbService.findMovieById(imdbId)
			.subscribe(
				data => this.movie = OmdbMovieModel.newMovie(data.json()),
				err => { alert(err); this.movie = OmdbMovieModel.emptyMovie() },
				() => { this.fetchingMovie = false}
			)
		this.libraries = libraryService.getLibrariesWith(imdbId)
		this.fetchingLibraries = false
	}
	// eventually, this will be part of a new component and logic will be moved out of here
	addMovie() {
		if(this.userService.getActiveUser()) {
			const movieToAdd: MovieModel = this.movieService.transformFromOmdb(this.movie)
			this.userService.addMovie(movieToAdd)
		} else {
			alert('sign in to add a movie!')
		}
	}
}