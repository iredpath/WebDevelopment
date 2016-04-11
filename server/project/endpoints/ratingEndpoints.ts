export default function(app, db) {

	app.post('/api/project/rating', (req, res) => {
		const newRating = req.body.rating
		db.createRating(newRating)
			.then(rating => { res.status(200).send({ rating }) },
			error => { res.status(400).send(error) })
	})

	app.put('/api/project/rating/:ratingId', (req, res) => {
		const newVal = req.body.rating
		const id = req.params.ratingId
		db.updateRating(id, newVal)
			.then(rating => { res.status(200).send({ rating }) },
				error => { res.status(400).send(error) })
	})

	app.delete('/api/project/rating/:id', (req, res) => {
		const id = req.params.id
		db.deleteRating(id)
			.then(rating => { res.status(200).send({ rating }) },
			error => { res.status(400).send(error) })
	})
}