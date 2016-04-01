import FormModel from '../models/form.model'

export default function FormEndpoints(app, formModel: FormModel) {

	app.get('/api/assignment/user/:userId/form', (req, res) => {
		const userId = req.params.userId
		formModel.findFormsByUser(userId)
			.then(forms => { res.status(200).send({ forms }) },
				error => { res.status(400).send({ error })})
	})

	app.get('/api/assignment/form/:formId', (req, res) => {
		const formId = req.params.formId
		formModel.findById(formId)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})

	app.delete('/api/assignment/form/:formId', (req, res) => {
		const formId = req.params.formId
		formModel.delete(formId)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})

	app.post('/api/assignment/user/:userId/form', (req, res) => {
		const userId = req.params.userId
		const newForm = req.body.form
		formModel.create(newForm)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})

	app.put('/api/assignment/form/:formid', (req, res) => {
		const formId = req.params.formId
		const newForm = req.body.form
		formModel.update(formId, newForm)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})
}
