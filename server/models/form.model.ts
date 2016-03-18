import * as _ from 'lodash'
export default class FormModel {

	forms: Array<any>
	idNumber: number

	constructor() {
		this.forms = require('./form.mock.json').forms
		this.idNumber = 999999999999
	}

	create(newForm) {
		newForm._id = (this.idNumber++).toString()
		newForm.fields = []
		this.forms.push(newForm)
		return this.findFormsByUser(newForm.userId)
	}

	findAll() {
		return this.forms
	}

	findById(id: string) {
		return _.find(this.forms, form => { return form._id === id })
	}

	update(id: string, what) {
		_.forEach(this.forms, form => {
			if (form._id === id) {
				form = what
				return what
			}
		})
		return null
	}

	delete(id: string) {
		const form = this.findById(id)
		_.remove(this.forms, form => { return form._id === id })
		return this.findFormsByUser(form.userId)
	}

	findformByTitle(title: string) {
		return _.find(this.forms, form => { return form.title === title })
	}

	findFormsByUser(userId: number) {
		console.log(this.forms)
		console.log(userId)
		return _.filter(this.forms, form => { 
			return form.userId.toString() === userId.toString()
		})
	}

	getFieldsForForm(formId: string): Array<any> {
		return this.findById(formId).fields
	}

	getFieldForForm(formId: string, fieldId: string) {
		const fields = this.getFieldsForForm(formId)
		return _.find(fields, field => { return field.id === fieldId })
	}

	deleteFieldForForm(formId: string, fieldId: string) {
		const form = this.findById(formId)
		const fields: Array<any> = form.fields
		_.remove(fields, field => { return field.id === fieldId })
		return fields
	}

	addFieldToForm(formId: string, field) {
		const form = this.findById(formId)
		field.id = (this.idNumber * 2).toString()
		form.fields.push(field)
		return form.fields
	}

	updateFieldForForm(formId: string, fieldId: string, field) {
		const form = this.findById(formId)
		const fields: Array<any> = form.fields
		fields.forEach(f => {
			if (field.id === fieldId) {
				f = field
			}
		})
		return fields
	}
}