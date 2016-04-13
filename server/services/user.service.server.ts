import * as passport from 'passport'
import * as local from 'passport-local'
import UserModel from '../models/user.model'

export default function Userendpoints(app, userModel: UserModel) {

	// (de)serialization funcs
	passport.serializeUser((user, done) => {
		done(null, user)
	})
	passport.deserializeUser((user, done) => {
		userModel.findById(user._id)
			.then(user => { done(null, user) }, err => { done(err, null) })
	})

	// local strategy
	const localStrat = (username, password, done) => {
		userModel.findUserByCredentials(username, password)
			.then(user => { return done(null, user ? user : false) },
			err => { return done(err) })
	}
	passport.use(new local.Strategy(localStrat))

	const authenticate = (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(401).send()
		} else {
			next()
		}
	}

	app.post('/api/assignment/login', passport.authenticate('local'), (req, res) => {
		res.status(200).send(req.user)
	})
	app.post('/api/assignment/logout', (req, res) => {
		req.logout()
		res.status(200).send({ message: 'logged out' })
	})
	app.get('/api/assignment/loggedin', (req, res) => {
		res.status(200).send(req.isAuthenticated() ? req.user : '0')
	})
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

	app.put('/api/assignment/user/:id', authenticate, (req, res) => {
		const id = req.params.id
		const newUser = req.body.user
		userModel.update(id, newUser)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})

	app.delete('/api/assignment/user/:id', authenticate, (req, res) => {
		const id = req.params.id
		userModel.delete(id)
			.then(user => { res.status(200).send({ user }) },
				error => { res.status(400).send({ error })})
	})

	const isAdmin = (req, res, next) => {
		if (!req.isAuthenticated || req.user.role !== 'admin') {
			res.status(403).send()
		} else {
			next()
		}
	}

	app.post('/api/assignment/admin/user', isAdmin, (req, res) => {
		const newUser = req.body.user
		userModel.create(newUser)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send({ error }) })
	})

	app.get('/api/assignment/admin/user', isAdmin, (req, res) => {
		userModel.findAll()
			.then(users => { res.status(200).send({ users }) },
			error => { res.status(400).send({ error }) })
	})

	app.put('/api/assignment/admin/user/:id', isAdmin, (req, res) => {
		const id = req.params.id
		const newUser = req.body.user
		userModel.update(id, newUser)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send({ error }) })
	})

	app.delete('/api/assignment/admin/user/:id', isAdmin, (req, res) => {
		const id = req.params.id
		userModel.delete(id)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send({ error }) })
	})
}