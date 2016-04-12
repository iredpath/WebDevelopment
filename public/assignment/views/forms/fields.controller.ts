import { View, Component } from 'angular2/core'
import { Router, RouterLink, RouteParams } from 'angular2/router'
import { Http } from 'angular2/http'
import { NgSwitch, NgSwitchWhen } from 'angular2/common'
import { UserService } from '../../services/user.service.client'
import { FieldsService } from '../../services/fields.service.client'

@Component({
	selector: "form-builder-fields"
})
@View({
	templateUrl: "/assignment/views/forms/form-fields.view.html",
	directives: [RouterLink, NgSwitch, NgSwitchWhen]
})

export class FieldsController {
	newFieldType: string
	newFieldMap: any
	formId: string
	fields: Array<any>
	fetching: boolean
	optionsMap: any

	constructor(public userService: UserService, public router: Router,
		public fieldsService: FieldsService, public http: Http, public params: RouteParams) {
		this.newFieldMap = {
			"TEXT": { "label": "New Text Field", "type": "TEXT", "placeholder": "New Field" },
			"TEXTAREA": { "label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field" },
			"DATE": { "label": "New Date Field", "type": "DATE" },
			"DROPDOWN": {
				"label": "New Dropdown", "type": "DROPDOWN", "options": [
					{ "label": "Option 1", "value": "OPTION_1" },
					{ "label": "Option 2", "value": "OPTION_2" },
					{ "label": "Option 3", "value": "OPTION_3" }
				]
			},
			"CHECKBOXES": {
				"label": "New Checkboxes", "type": "CHECKBOXES", "options": [
					{ "label": "Option A", "value": "OPTION_A" },
					{ "label": "Option B", "value": "OPTION_B" },
					{ "label": "Option C", "value": "OPTION_C" }
				]
			},
			"RADIOS": {
				"label": "New Radio Buttons", "type": "RADIOS", "options": [
					{ "label": "Option X", "value": "OPTION_X" },
					{ "label": "Option Y", "value": "OPTION_Y" },
					{ "label": "Option Z", "value": "OPTION_Z" }
				]
			}
		}
		this.userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.userService.setActiveUser(user.json())
					this.fetching = true
					this.formId = params.get('formId')
					this.optionsMap = {}
					fieldsService.getFieldsForForm(this.formId)
						.subscribe(resp => {
							this.fields = resp.json().fields
							this.updateOptions()
							this.fetching = false
					})
				} else {
					router.navigate(['/Login', {}]) 
				}
		})
	}

	getNewField() {
		return this.newFieldMap[this.newFieldType]
	}
	addNewField() {
		this.fieldsService.createFieldForForm(this.formId, this.getNewField())
			.subscribe(resp => {
				if (resp.json().form) {
					this.fields = resp.json().form.fields
					this.updateOptions()
				} else {
					alert(resp.json().error)
				}
			})
	}

	deleteField(fieldId: string) {
		this.fieldsService.deleteFieldFromForm(this.formId, fieldId)
			.subscribe(resp => {
				if (resp.json().form) {
					this.fields = resp.json().form.fields
					this.updateOptions()
				} else {
					alert(resp.json().error)
				}
		})
	}

	update(field) {
		if (field.options) {
			field.options = this.getOptionsFor(field._id)
		}
		console.log(field.options)
		this.fieldsService.updateField(this.formId, field._id, field)
			.subscribe(resp => {
				const newForm = resp.json().form
				if (newForm) {
					this.fields = newForm.fields
					this.updateOptions()
				} else {
					alert(resp.json().error)
				}
			})
	}

	getOptionsFor(id) {
		const optionString = this.optionsMap[id]
		const optionsArray = optionString.split('\n')
		let retVal = []
		_.forEach(optionsArray, opt => {
			if (opt) {
				const labelValuePair = opt.split(":")
				retVal.push({ label: labelValuePair[0], value: labelValuePair[1] })
			} 
		})
		return retVal
	}
	isTextField(type) {
		return type === 'TEXT' || type === 'TEXTAREA'
	}
	isOptionField(field) {
		return field.type === 'DROPDOWN' || field.type === 'RADIOS' || field.type === 'CHECKBOXES'
	}

	updateOptions() {
		this.fields.forEach(field => {
			if (field.options) {
				let base = ""
				_.forEach(field.options, opt => {
					base += `${opt.label}:${opt.value}\n`
				})
				this.optionsMap[field._id] = base
			}
		})
	}
}