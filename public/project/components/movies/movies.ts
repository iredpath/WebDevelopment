import { View, Component, Inject } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { MovieModel } from '../../models/movieModel'
import { MovieService } from '../../services/movieService'

@Component({
	selector: "vml-movies"
})
@View({
	templateUrl: "/project/components/movies/movies.view.html",
	directives: [RouterLink]
})

export class Movies {

	movies: Array<MovieModel>
	fetchingMovies: boolean

	constructor(public movieService: MovieService) {
		this.fetchingMovies = true
		this.movieService.getAll()
			.subscribe(resp => {
				if (resp.json().movies) {
					this.movies = resp.json().movies
				} else {
					alert('error fetching all movies')
				}
				this.fetchingMovies = false
			})
	}
}