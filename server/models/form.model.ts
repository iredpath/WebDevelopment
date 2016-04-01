import * as mongoose from 'mongoose'
import * as _ from 'lodash'
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
		this.formModel.findByIdAndUpdate(id, _.omit(what, '_id'), { new: true }, (err, resp) => {
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
				_.remove(form.fields, field => {
					// I have NO idea why I need toString() here, but I do
					return (<any>field)._id.toString() === fieldId.toString()
				})
				delete form._id
				this.formModel.findByIdAndUpdate(formId, form, { new: true }, (err, resp) => {
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
				delete form._id
				form.fields = _.map(form.fields, f => { 
					delete (<any>f)._id
					return f
				})
				console.log(form)
				this.formModel.findByIdAndUpdate(formId, form, { new: true }, (err, resp) => {
					console.log(`${err} as error, ${resp} as resp`)
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
					// Same toString weirdness here
					return (<any>f)._id.toString() === fieldId.toString() ? field : f
				})
				delete form._id
				this.formModel.findByIdAndUpdate(formId, form, { new: true }, (err, resp) => {
					err ? deferred.reject(err) : deferred.resolve(resp)
				})
			}
		})
		return deferred.promise
	}
}