import UserModel from '../models/user.model'

export default function Userendpoints(app, userModel: UserModel) {

	app.post('/api/assignment/user', (req, res) => {
		const newUser = req.body.user
		userModel.create(newUser)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})

	app.get('/api/assignment/user', (req, res) => {
		const query = req.query
		const { password, username } = query
		if (username && password) {
			userModel.findUserByCredentials(username, password)
				.then(user => { res.status(200).send({ user }) },
					error => { res.status(400).send({ error })})
		} else if (username) {
			userModel.findUserByUsername(username)
				.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error }) })
		} else {
			userModel.findAll()
				.then(users => { res.status(200).send({ users }) },
					error => { res.status(400).send({ error })})
		}
	})

	app.get('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		userModel.findById(id)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})

	app.put('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		const newUser = req.body.user
		userModel.update(id, newUser)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})

	app.delete('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		userModel.delete(id)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})
}