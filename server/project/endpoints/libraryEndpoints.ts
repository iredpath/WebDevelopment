export default function(app, db) {

	app.get('/api/project/library', (req, res) => {
		db.getAllLibraries()
			.then(libraries => { res.status(200).send({ libraries }) },
				error => { res.status(400).send(error) })

	})

	app.get('/api/project/library/:id', (req, res) => {
		const id = req.params.id
		db.getLibraryById(id)
			.then(data => { res.status(200).send({ data }) },
			error => { res.status(400).send(error) })

	})

	app.post('/api/project/library', (req, res) => {
		const newLibrary = req.body.library
		db.createLibrary(newLibrary)
			.then(library => { res.status(200).send({ library }) },
			error => { res.status(400).send(error) })

	})

	app.put('/api/project/library', (req, res) => {
		const updatedLibrary = req.body.library
		db.updateLibrary(updatedLibrary)
			.then(library => { res.status(200).send({ library }) },
			error => { res.status(400).send(error) })

	})

	app.delete('/api/project/library/:id', (req, res) => {
		const id = req.params.id
		db.deleteLibrary(id)
			.then(library => { res.status(200).send({ library }) },
			error => { res.status(400).send(error) })

	})

	app.delete('/api/project/library/:libId/movie/:movId', (req, res) => {
		const { libId, movId } = req.params
		db.deleteMovieFromLibrary(movId, libId)
			.then(library => { res.status(200).send({ library }) },
			error => { res.status(400).send(error) })

	})

	app.post('/api/project/library/:libId/comment', (req, res) => {
		const { comment } = req.body
		const libId = req.params.libId
		db.addCommentToLibrary(libId, comment)
			.then(comment => { res.status(200).send({ comment }) },
				error => { res.status(400).send(error) })
	})
	app.put('/api/project/library/:libId/comment/:commentId', (req, res) => {
		const { commentText } = req.body
		const { libId, commentId } = req.params
		db.editCommentForLibrary(libId, commentId, commentText)
			.then(comment => { res.status(200).send({ comment }) },
			error => { res.status(400).send(error) })
	})
}