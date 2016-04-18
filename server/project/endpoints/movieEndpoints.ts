export default function(app, db) {

	app.get('/api/project/movie', (req, res) => {
		const query = req.query
		if (query.imdbId) {
			db.getMovieByImdbId(query.imdbId)
				.then(data => { res.status(200).send({ data }) },
					error => { res.status(400).send(error) })
		} else {
			db.getAllMovies()
				.then(movies => { res.status(200).send({ movies }) },
					error => { res.status(400).send(error) })
		}
	})

	app.get('/api/project/movie/:id', (req, res) => {
		const id = req.params.id
		db.getMovieById(id)
			.then(data => { res.status(200).send({ data }) },
			error => { res.status(400).send(error) })
	})

	app.post('/api/project/movie', (req, res) => {
		const newMovie = req.body.movie
		db.createMovie(newMovie)
			.then(data => { res.status(200).send({ data }) },
			error => { res.status(400).send(error) })
	})

	app.put('/api/project/movie', (req, res) => {
		const body = req.body
		if (body.library) {
			db.addMovieToLibrary(body.movie, body.library)
				.then(data => { res.status(200).send({ data }) },
				error => { res.status(400).send(error) })
		} else {
			db.updateMovie(body.movie)
				.then(movie => { res.status(200).send({ movie }) },
				error => { res.status(400).send(error) })
		}
	})

	app.delete('/api/project/movie/:id', (req, res) => {
		const id = req.params.id
		db.deleteMovie(id)
			.then(movie => { res.status(200).send({ movie }) },
			error => { res.status(400).send(error) })
	})

	app.post('/api/project/movie/:movieId/comment', (req, res) => {
		const { comment } = req.body
		const movieId = req.params.movieId
		db.addCommentToMovie(movieId, comment)
			.then(comment => { res.status(200).send({ comment }) },
			error => { res.status(400).send(error) })
	})
	app.put('/api/project/movie/:movieId/comment/:commentId', (req, res) => {
		const { commentText } = req.body
		const { movieId, commentId } = req.params
		db.editCommentForMovie(movieId, commentId, commentText)
			.then(comment => { res.status(200).send({ comment }) },
			error => { res.status(400).send(error) })
	})
}