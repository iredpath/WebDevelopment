import UserModel from '../models/user.model'

export default function Userendpoints(app, userModel: UserModel) {

	app.post('/api/assignment/user', (req, res) => {
		const newUser = req.body.user
		const updatedUsers: Array<any> = userModel.create(newUser)
		res.status(200).send({ users: updatedUsers })
	})

	app.get('/api/assignment/user', (req, res) => {
		const query = req.query
		const { password, username } = query
		if (username && password) {
			const user = userModel.findUserByCredentials(username, password)
			res.status(200).send({ user })
		} else if (username) {
			const user = userModel.findUserByUsername(username)
			res.status(200).send({ user })
		} else {
			const users = userModel.findAll()
			res.status(200).send({ users })
		}
	})

	app.get('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		const user = userModel.findById(id)
		res.status(200).send({ user })
	})

	app.put('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		const newUser = req.body.user
		const updatedUsers = userModel.update(id, newUser)
		res.status(200).send({ users: updatedUsers })
	})

	app.delete('/api/assignment/user/:id', (req, res) => {
		const id = req.params.id
		const updatedUsers = userModel.delete(id)
		res.status(200).send({ users: updatedUsers })
	})
}