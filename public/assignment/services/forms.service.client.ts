import { Injectable } from 'angular2/core'
import { Form } from '../models/form.model'

@Injectable()
export class FormsService {

	forms:Array<Form>

	constructor() {

		const formData = [
  			{"_id": "000", "title": "Contacts", "userId": 123},
  			{"_id": "010", "title": "ToDo",     "userId": 123},
  			{"_id": "020", "title": "CDs",      "userId": 234},
		]
		// Create forms based on formData
		this.forms = _.map(formData, (formObj) => {
			let form = new Form()
			form.configure(formObj)
			return form
		})
	}

	createFormForUser(userId, form, callback) {
		form.setId((new Date).getTime())
		form.setUserId(userId)
		this.forms.push(form)
		callback(form)
	}	

	findAllFormForUser(userId, callback) {
		callback(_.filter(this.forms, form => form.getUserId() === userId))
	}

	deleteFormById(formId, callback) {
		callback(_.remove(this.forms, form => form.getId() === formId))
	}

	updateFormById(formId, newForm, callback) {
		callback(_.forEach(this.forms, form => {
			if(form.getId() === formId) {
				form = newForm
				return
			}
		}))
	}
}