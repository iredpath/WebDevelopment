export default function(app, db) {

	app.get('/api/project/user', (req, res) => {
		const query = req.query
		const { username, password } = query
		if (username && password) {
			const user = db.getUserByCredentials(username, password)
			res.status(200).send({ user })
		} else if (username) {
			const user = db.getUserByUsername(username)
			res.status(200).send({ user })
		} else {
			const users = db.getAllUsers()
			res.status(200).send({ users })
		}

	})

	app.get('/api/project/user/:id', (req, res) => {
		const id = req.params.id
		const user = db.getUserById(id)
		res.status(200).send({ user })
	})

	app.post('/api/project/user', (req, res) => {
		const newUser = req.body.user
		const user = db.createUser(newUser)
		res.status(200).send({ user })
	})

	app.put('/api/project/user', (req, res) => {
		const updatedUser = req.body.user
		const user = db.updateUser(updatedUser)
		res.status(200).send({ user })
	})

	app.delete('/api/project/user/:id', (req, res) => {
		const id = req.params.id
		const user = db.deleteUser(id)
		res.status(200).send({ user })
	})

	app.delete('/api/project/user/:id/library/:libId', (req, res) => {
		const { id, libId } = req.params
		const user = db.deleteLibraryForUser(libId, id)
		res.status(200).send({ user })
	})
}