import FormModel from '../models/form.model'

export default function FormEndpoints(app, formModel: FormModel) {

	app.get('/api/assignment/user/:userId/form', (req, res) => {
		const userId = req.params.userId
		const forms = formModel.findFormsByUser(userId)
		res.status(200).send({ forms })
	})

	app.get('/api/assignment/form/:formId', (req, res) => {
		const formId = req.params.formId
		const form = formModel.findById(formId)
		res.status(200).send({ form })
	})

	app.delete('/api/assignment/form/:formId', (req, res) => {
		const formId = req.params.formId
		const updatedForms = formModel.delete(formId)
		res.status(200).send({ forms: updatedForms })
	})

	app.post('/api/assignment/user/:userId/form', (req, res) => {
		const userId = req.params.userId
		const newForm = req.body.form
		const updatedForms = formModel.create(newForm)
		res.status(200).send({ forms: updatedForms })
	})

	app.put('/api/assignment/form/:formid', (req, res) => {
		const formId = req.params.formId
		const newForm = req.body.form
		const updatedForms = formModel.update(formId, newForm)
		res.status(200).send({ forms: updatedForms })
	})
}
