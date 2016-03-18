import FormModel from '../models/form.model'

export default function FieldEndpoints(app, formModel: FormModel) {

	app.get('/api/assignment/form/:formId/field', (req, res) => {
		const formId = req.params.formId
		const fields = formModel.getFieldsForForm(formId)
		res.status(200).send({ fields })
	})

	app.get('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		const field = formModel.getFieldForForm(formId, fieldId)
		res.status(200).send({ field })
	})

	app.delete('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		const updatedFields = formModel.deleteFieldForForm(formId, fieldId)
		res.status(200).send({ fields: updatedFields })
	})

	app.post('/api/assignment/form/:formId/field', (req, res) => {
		const formId = req.params.formId
		const field = req.body.field
		const updatedFields = formModel.addFieldToForm(formId, field)
		res.status(200).send({ fields: updatedFields })
	})

	app.put('/api/assignment/form/:formId/field/:fieldId', (req, res) => {
		const { formId, fieldId } = req.params
		const field = req.body.field
		const updatedFields = formModel.updateFieldForForm(formId, fieldId, field)
		res.status(200).send({ fields: updatedFields })
	})
}
