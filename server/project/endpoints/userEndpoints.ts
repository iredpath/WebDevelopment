export default function(app, db) {

	app.get('/api/project/user', (req, res) => {
		const query = req.query
		const { password, username } = query
		if (username && password) {
			db.getUserByCredentials(username, password)
				.then(data => { res.status(200).send({ data }) },
				error => { res.status(400).send(error) })
		} else if (username) {
			db.getUserByUsername(username)
				.then(data => { res.status(200).send({ data }) },
				error => { res.status(400).send(error) })
		} else {
			db.getAllUsers()
				.then(users => { res.status(200).send({ users }) },
				error => { res.status(400).send(error) })
		}

	})

	app.get('/api/project/user/:id', (req, res) => {
		const id = req.params.id
		db.getUserById(id)
			.then(data => { res.status(200).send({ data }) },
			error => { res.status(400).send(error) })
	})

	app.post('/api/project/user', (req, res) => {
		const newUser = req.body.user
		db.createUser(newUser)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send(error) })
	})

	app.put('/api/project/user', (req, res) => {
		const updatedUser = req.body.user
		db.updateUser(updatedUser)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send(error) })
	})

	app.delete('/api/project/user/:id', (req, res) => {
		const id = req.params.id
		db.deleteUser(id)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send(error) })
	})

}