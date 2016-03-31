import * as mongoose from 'mongoose'
import * as Q from 'q'
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
		this.formModel.findByIdAndUpdate(id, what, { new: true }, (err, resp) => {
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
		this.formModel.find({ userId }, (err, resp) => {
			err ? deferred.reject(err) : deferred.resolve(resp)
		})
		return deferred.promise
	}

	getFieldsForForm(formId: string) {
		let deferred = Q.defer()
		this.formModel.findById(formId, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				// get the fields
				deferred.resolve(resp.fields)
			}
		})
		return deferred.promise
	}

	getFieldForForm(formId: string, fieldId: string) {
		let deferred = Q.defer()
		this.formModel.findById(formId, (err, resp) => {
			if (err) {
				deferred.reject(err)
			} else {
				deferred.resolve(_.find(resp.fields, field => { return (<any>field)._id === fieldId }))
			}
		})
		return deferred.promise
	}

	deleteFieldForForm(formId: string, fieldId: string) {
		let deferred = Q.defer()
		this.formModel.findById(formId, (err, form) => {
			if (err) {
				deferred.reject(err)
			} else {
				_.remove(form.fields, field => { return (<any>field)._id === fieldId })
				this.formModel.save(form, (err, resp) => {
					err ? deferred.reject(err) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}

	addFieldToForm(formId: string, field) {
		let deferred = Q.defer()
		this.formModel.findById(formId, (err, form) => {
			if (err) {
				deferred.reject(err)
			} else {
				form.fields.push(field)
				form.save(form, (err, resp) => {
					err ? deferred.reject(err) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}

	updateFieldForForm(formId: string, fieldId: string, field) {
		let deferred = Q.defer()
		this.formModel.findById(formId, (err, form) => {
			if (err) {
				deferred.reject(err)
			} else {
				form.fields = _.map(form.fields, f => {
					return (<any>f)._id === fieldId ? field : f
				})
				this.formModel.save(form, (err, resp) => {
					err ? deferred.reject(err) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}
}