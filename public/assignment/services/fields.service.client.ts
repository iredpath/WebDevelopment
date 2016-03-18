import { Injectable } from 'angular2/core'
import { Http, Headers } from 'angular2/http'
import { Form } from '../models/form.model'

@Injectable()
export class FieldsService {

	headers

	constructor(public http: Http) {
		this.headers = new Headers()
		this.headers.append("Content-Type", "application/json")
	}

	createFieldForForm(formId: string, field) {
		return this.http.post(`/api/assignment/form/${formId}/field`, JSON.stringify({ field }),
			{ headers: this.headers })
	}

	getFieldsForForm(formId: string) {
		return this.http.get(`/api/assignment/form/${formId}/field`)
	}

	getFieldForForm(formId: string, fieldId: string) {
		return this.http.get(`/api/assignment/form/${formId}/field/${fieldId}`)
	}

	deleteFieldFromForm(formId: string, fieldId: string) {
		return this.http.delete(`/api/assignment/form/${formId}/field/${fieldId}`)
	}

	updateField(formId: string, fieldId: string, field) {
		return this.http.put(`/api/assignment/form/${formId}/field`, JSON.stringify({ field }),
			{ headers: this.headers })
	}

}