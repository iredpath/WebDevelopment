import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'
import { Form } from '../models/form.model'

@Injectable()
export class FormsService {

	headers

	constructor(public http: Http) { 
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	createFormForUser(userId, form) {
		return this.http.post(`/api/assignment/user/${userId}/form`, JSON.stringify({ form: form }),
			{ headers: this.headers })
	}	

	findAllFormsForUser(userId) {
		return this.http.get(`/api/assignment/user/${userId}/form`)
	}

	deleteFormById(formId) {
		return this.http.delete(`/api/assignment/form/${formId}`)
	}

	updateFormById(formId, newForm) {
		return this.http.put(`/api/assignment/form/${formId}`, JSON.stringify({ form: newForm }),
			{ headers: this.headers })
	}
}