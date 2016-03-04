export class MovieModel {

	id: number
	imdbId: string
	title: string

	constructor() {}

	static newMovie(data: any) {
		let movie: MovieModel = new MovieModel()
		movie.configure(data)
		return movie
	}

	configure(data:any) {
		this.id = data.id
		this.imdbId = data.imdbId
		this.title = data.title
	}
}