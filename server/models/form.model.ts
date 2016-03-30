import * as mongoose from 'mongoose'
import FormSchema from './form.schema.server'
import FieldSchema from './field.schema.server'

export default class FormModel {

	db: any
	formSchema: any
	formModel: any
	fieldSchema: any
	fieldModel: any

	constructor(db) {
		this.formSchema = FormSchema()
		this.formModel = mongoose.model('Form', this.formSchema)
		this.fieldSchema = FieldSchema()
		this.fieldModel = mongoose.model('Field', this.fieldSchema)
	}

	create(newForm) {
		let deferred = Q.defer()
		this.formModel.create(newForm, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findAll() {
		let deferred = Q.defer()
		this.formModel.find({}, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findById(id: string) {
		let deferred = Q.defer()
		this.formModel.findById(id, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	update(id: string, what) {
		let deferred = Q.defer()
		this.formModel.findByIdAndUpdate(id, what, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	delete(id: string) {
		let deferred = Q.defer()
		this.formModel.findByIdAndRemove(id, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findformByTitle(title: string) {
		let deferred = Q.defer()
		this.formModel.findOne({ title }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	findFormsByUser(userId: number) {
		let deferred = Q.defer()
		this.formModel.findOne({ userId }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getFieldsForForm(formId: string): Array<any> {
		return this.findById(formId).fields
	}

	getFieldForForm(formId: string, fieldId: string) {
		const fields = this.getFieldsForForm(formId)
		return _.find(fields, field => { return field._id.toString() === fieldId.toString() })
	}

	deleteFieldForForm(formId: string, fieldId: string) {
		const form = this.findById(formId)
		const fields: Array<any> = form.fields
		_.remove(fields, field => { return field._id.toString() === fieldId.toString() })
		return fields
	}

	addFieldToForm(formId: string, field) {
		const form = this.findById(formId)
		field._id = (this.idNumber * 2).toString()
		form.fields.push(field)
		return form.fields
	}

	updateFieldForForm(formId: string, fieldId: string, field) {
		console.log(field)
		const form = this.findById(formId)
		const fields: Array<any> = form.fields
		form.fields = fields.map(f => {
			if (f._id.toString() === fieldId) {
				return field
			}
			return f
		})
		return form.fields
	}
}