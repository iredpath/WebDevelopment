export default function(app, db) {

	app.get('/api/project/library', (req, res) => {
		const libraries = db.getAllLibraries()
		res.status(200).send({ libraries })

	})

	app.get('/api/project/library/:id', (req, res) => {
		const id = req.params.id
		const library = db.getLibraryById(id)
		res.status(200).send({ library })
	})

	app.post('/api/project/library', (req, res) => {
		const newLibrary = req.body.library
		const library = db.createLibrary(newLibrary)
		res.status(200).send({ library })
	})

	app.put('/api/project/library', (req, res) => {
		const updatedLibrary = req.body.library
		const library = db.updateLibrary(updatedLibrary)
		res.status(200).send({ library })
	})

	app.delete('/api/project/library/:id', (req, res) => {
		const id = req.params.id
		const library = db.deleteLibrary(id)
		res.status(200).send({ library })
	})

	app.delete('/api/project/library/:libId/movie/:movId', (req, res) => {
		const { libId, movId } = req.params
		const library = db.deleteMovieFromLibrary(movId, libId)
		res.status(200).send({ library })
	})
}