import { MovieModel } from '../models/movieModel'
import { OmdbMovieModel } from '../models/omdbMovieModel'

export class MovieService {

	movies: Object

	constructor() {
		this.movies = {}
		const sampleData = [
			{ id: 1, imdbId: "tt0120338", title: "Titanic" },
			{ id: 2, imdbId: "tt0096895", title: "Batman" },
			{ id: 3, imdbId: "tt1431045", title: "Deadpool" }
		]
		_.forEach(sampleData, mov => {
			let model: MovieModel = MovieModel.newMovie(mov)
			this.addMovie(model)
		})
	}

	get(id: string) {
		return this.movies[id]
	}
	getAll() {
		return <Array<MovieModel>> _.values(this.movies)
	}
	addMovie(movie: MovieModel) {
		this.movies[movie.imdbId] = movie
	}
	transformFromOmdb(movie: OmdbMovieModel) {
		// if it exists, return it 
		const exists: MovieModel = _.find(this.getAll(), mov => { return mov.imdbId === movie.imdbId })
		if(exists) {
			return exists
		} else {
			// add it, then return
			const newMovie: MovieModel = MovieModel.newMovie(movie)
			this.addMovie(newMovie)
			return newMovie
		}
	}

}