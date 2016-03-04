import { Injectable } from 'angular2/core'

@Injectable()
export class OmdbMovieModel {

	title: string
	year: number
	rating: string
	releaseDate: string
	runtime: string
	genres: Array<string>
	directors: Array<string>
	writers: Array<string>
	actors: Array<string>
	plot: string
	languages: Array<string>
	countries: Array<string>
	awards: string
	image: string
	metascore: number
	imdbRating: number
	imdbVotes: string
	imdbId: string
	type: string
	tomatoMeter: number
	tomatoFreshness: string
	tomatoRating: number
	tomatoReviews: number
	tomatoFresh: number
	tomatoRotten: number
	tomatoConsensus: string
	tomatoUserMeter: number
	tomatoUserRating: number
	tomatoUserReviews: number
	tomatoUrl: string
	dvd: string
	boxOffice: string
	production: string
	website: string


	constructor() { }
	static newMovie(movieData: any): OmdbMovieModel {
		let movie: OmdbMovieModel = new OmdbMovieModel()
		movie.configure(movieData)
		return movie
	}
	static emptyMovie(): OmdbMovieModel {
		return new OmdbMovieModel()
	}
	configure(movieData: any): void {
		this.title = movieData.Title
		this.year = +movieData.Year
		this.rating = movieData.Rated
		this.releaseDate = movieData.Released
		this.runtime = movieData.Runtime
		this.genres = movieData.Genre && movieData.Genre.split(",")
		this.directors = movieData.Director && movieData.Director.split(",")
		this.writers = movieData.Writer && movieData.Writer.split(",")
		this.actors = movieData.Actors && movieData.Actors.split(",")
		this.plot = movieData.Plot
		this.languages = movieData.Language && movieData.Language.split(",")
		this.countries = movieData.Country && movieData.Country.split(",")
		this.awards = movieData.Awards
		this.image = movieData.Poster
		this.metascore = +movieData.Metascore
		this.imdbRating = +movieData.imdbRating
		this.imdbVotes = movieData.imdbVotes
		this.imdbId = movieData.imdbID
		this.type = movieData.Type
		this.tomatoMeter = movieData.tomatoMeter
		this.tomatoFreshness = movieData.tomatoImage
		this.tomatoRating = movieData.tomatoRating
		this.tomatoReviews = movieData.tomatoReviews
		this.tomatoFresh = movieData.tomatoFresh
		this.tomatoRotten = movieData.tomatoRotten
		this.tomatoConsensus = movieData.tomatoConsensus
		this.tomatoUserMeter = movieData.tomatoUserMeter
		this.tomatoUserRating = movieData.tomatoUserRating
		this.tomatoUserReviews = movieData.tomatoUserReviews
		this.tomatoUrl = movieData.tomatoURL
		this.dvd = movieData.DVD
		this.boxOffice = movieData.BoxOffice
		this.production = movieData.Production
		this.website = movieData.Website
	}

}