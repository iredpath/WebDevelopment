import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'
import { MovieModel } from '../models/movieModel'
import { OmdbMovieModel } from '../models/omdbMovieModel'

@Injectable()
export class MovieService {

	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
		/*const sampleData = [
			{ id: 1, imdbId: "tt0120338", title: "Titanic" },
			{ id: 2, imdbId: "tt0096895", title: "Batman" },
			{ id: 3, imdbId: "tt1431045", title: "Deadpool" }
		]
		_.forEach(sampleData, mov => {
			let model: MovieModel = MovieModel.newMovie(mov)
			this.addMovie(model)
		})*/
	}

	get(id: string) {
		return this.http.get(`/api/project/movie/${id}`,
			{ headers: this.headers })
		//return this.movies[id]
	}
	getAll() {
		return this.http.get('/api/project/movie',
			{ headers: this.headers })
		//return <Array<MovieModel>> _.values(this.movies)
	}
	addMovie(movie: MovieModel) {
		return this.http.post('/api/project/movie', JSON.stringify({ movie }),
			{ headers: this.headers })
		//this.movies[movie.imdbId] = movie
	}
	/*
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
	}*/

	getMoviesForUser(id: string) {
		return this.http.get(`/api/project/movie?user=${id}`,
			{ headers: this.headers })
	}

	addMovieToLibrary(movie: any, libId: string) {
		return this.http.put('/api/project/movie', JSON.stringify({ library: libId, movie }),
			{ headers: this.headers })
	}

}