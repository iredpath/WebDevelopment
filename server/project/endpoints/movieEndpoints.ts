export default function(app, db) {

	app.get('/api/project/movie', (req, res) => {
		const query = req.query
		if (query.id && query.title) {
			const movie = db.getMovie(query.id, query.title)
			res.status(200).send({ movie })
		} else {
			const movies = db.getAllMovies()
			res.status(200).send({ movies })
		}
	})

	app.get('/api/project/movie/:id', (req, res) => {
		const id = req.params.id
		const movie = db.getMovieById(id)
		res.status(200).send({ movie })
	})

	app.post('/api/project/movie', (req, res) => {
		const newMovie = req.body.movie
		const movie = db.createMovie(newMovie)
		res.status(200).send({ movie })
	})

	app.put('/api/project/movie', (req, res) => {
		const body = req.body
		console.log(body)
		const movie = body.library ?
			db.addMovieToLibrary(body.movie, body.library) :
			db.updateMovie(body.movie)
		res.status(200).send({ movie })
	})

	app.delete('/api/project/movie/:id', (req, res) => {
		const id = req.params.id
		const movie = db.deleteMovie(id)
		res.status(200).send({ movie })
	})
}