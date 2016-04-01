import FormModel from '../models/form.model'

export default function FieldEndpoints(app, formModel: FormModel) {

	app.get('/api/assignment/form/:formId/field', (req, res) => {
		const formId = req.params.formId
		formModel.getFieldsForForm(formId)
			.then(fields => { res.status(200).send({ fields }) },
				error => { res.status(400).send({ error })})
	})

	app.get('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		formModel.getFieldForForm(formId, fieldId)
			.then(field => { res.status(200).send({ field }) },
				error => { res.status(400).send({ error })})

	})

	app.delete('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		formModel.deleteFieldForForm(formId, fieldId)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error })})
	})

	app.post('/api/assignment/form/:formId/field', (req, res) => {
		const formId = req.params.formId
		const field = req.body.field
		formModel.addFieldToForm(formId, field)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})

	app.put('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		const newField = req.body.field
		formModel.updateFieldForForm(formId, fieldId, newField)
			.then(form => { res.status(200).send({ form }) },
				error => { res.status(400).send({ error }) })
	})
}
