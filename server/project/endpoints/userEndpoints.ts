import * as passport from 'passport'
import * as local from 'passport-local'
import * as _ from 'lodash'

export default function(app, db) {

	// local strategy
	const localStrat = (username, password, done) => {
		db.getUserByCredentials(username, password)
			.then(user => {
				console.log('non error case')
				return user ? done(null, user) : done(null, false, { message: 'invalid username/password' })
			}, err => { 
				console.log('error case')
				return done(null, false, err)
			})
	}
	passport.use('project', new local.Strategy(localStrat))

	const authenticate = (req, res, next) => {
		if (!req.isAuthenticated()) {
			res.status(401).send()
		} else {
			next()
		}
	}
	app.post('/api/project/login', (req, res, next) => {
		passport.authenticate('project', (err, user) => {
			req.logIn(user, () => { 
				res.status(err ? 400 : 200).send(err ? err : { user: req.user })
			})
		})(req, res, next)
	})
	app.post('/api/project/logout', (req, res) => {
		req.logout()
		res.status(200).send({ message: 'logged out' })
	})
	app.get('/api/project/loggedin', (req, res) => {
		res.status(200).send(req.isAuthenticated() ? req.user : '0')
	})

	app.get('/api/project/user', (req, res) => {
		const { username } = req.query
		if (username) {
			db.getUserByUsername(username)
				.then(data => { 
					res.status(200).send({ data }) },
				error => { res.status(400).send(error) })
		} else {
			db.getAllUsers()
				.then(users => { res.status(200).send({ users }) },
				error => { res.status(400).send(error) })
		}

	})

	app.get('/api/project/user/:id', (req, res) => {
		const id = req.params.id
		db.getUserWithEverythingById(id)
			.then(data => {
				res.status(200).send({ data })
			},
			error => { res.status(400).send(error) })
	})

	app.post('/api/project/user', (req, res) => {
		const newUser = req.body.user
		db.createUser(newUser)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send(error) })
	})

	app.put('/api/project/user', authenticate, (req, res) => {
		const updatedUser = req.body.user
		db.updateUser(updatedUser)
			.then(data => {
				res.status(200).send({ data })
			},
			error => { res.status(400).send(error) })
	})

	app.delete('/api/project/user/:id', authenticate, (req, res) => {
		const id = req.params.id
		db.deleteUser(id)
			.then(user => { res.status(200).send({ user }) },
			error => { res.status(400).send(error) })
	})

}