import { View, Component } from 'angular2/core'
import { Router, RouterLink, RouteParams } from 'angular2/router'
import { Http } from 'angular2/http'
import { NgSwitch, NgSwitchWhen } from 'angular2/common'
import { StateService } from '../../services/state.service.client'
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

	constructor(public stateService: StateService, public router: Router,
		public fieldsService: FieldsService, public http: Http, public params: RouteParams) {
		if (!stateService.isActiveUser()) {
			router.navigate(['/Login', {}])
		} else {
			this.fetching = true
			this.newFieldMap = {
				"TEXT": { "_id": null, "label": "New Text Field", "type": "TEXT", "placeholder": "New Field" },
				"TEXTAREA": { "_id": null, "label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field" },
				"DATE": { "_id": null, "label": "New Date Field", "type": "DATE" },
				"DROPDOWN": {
					"_id": null, "label": "New Dropdown", "type": "DROPDOWN", "options": [
						{ "label": "Option 1", "value": "OPTION_1" },
						{ "label": "Option 2", "value": "OPTION_2" },
						{ "label": "Option 3", "value": "OPTION_3" }
					]
				},
				"CHECKBOXES": {
					"_id": null, "label": "New Checkboxes", "type": "CHECKBOXES", "options": [
						{ "label": "Option A", "value": "OPTION_A" },
						{ "label": "Option B", "value": "OPTION_B" },
						{ "label": "Option C", "value": "OPTION_C" }
					]
				},
				"RADIOS": {
					"_id": null, "label": "New Radio Buttons", "type": "RADIOS", "options": [
						{ "label": "Option X", "value": "OPTION_X" },
						{ "label": "Option Y", "value": "OPTION_Y" },
						{ "label": "Option Z", "value": "OPTION_Z" }
					]
				}
			}
			this.formId = params.get('formId')
			this.optionsMap = {}
			fieldsService.getFieldsForForm(this.formId)
				.subscribe(resp => {
					this.fields = resp.json().fields
					this.updateOptions()
					this.fetching = false
				})
		}

	}

	getNewField() {
		return this.newFieldMap[this.newFieldType]
	}
	addNewField() {
		console.log(this.newFieldType)
		console.log(this.getNewField())
		this.fieldsService.createFieldForForm(this.formId, this.getNewField())
			.subscribe(resp => {
				this.fields = resp.json().fields
				this.updateOptions()
			})
	}

	deleteField(fieldId: string) {
		this.fieldsService.deleteFieldFromForm(this.formId, fieldId)
			.subscribe(resp => {
				this.fields = resp.json().fields
				this.updateOptions()
		})
	}

	update(field) {
		if (field.options) {
			field.options = this.getOptionsFor(field._id)
		}
		this.fieldsService.updateField(this.formId, field._id, field)
			.subscribe(resp => {
				this.fields = resp.json().fields
				this.updateOptions()
			})
	}

	getOptionsFor(id) {
		const optionString = this.optionsMap[id]
		const optionsArray = optionString.split('\n')
		return optionsArray.map(opt => {
			const labelValuePair = opt.split(":")
			return { label: labelValuePair[0], value: labelValuePair[1] }
		})
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
				field.options.forEach(opt => {
					base += `${opt.label}:${opt.value}\n`
				})
				this.optionsMap[field._id] = base
			}
		})
	}
}