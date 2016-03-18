import { View, Component } from 'angular2/core'
import { Router, RouterLink, RouteParams } from 'angular2/router'
import { Http } from 'angular2/http'
import { StateService } from '../../services/state.service.client'
import { FieldsService } from '../../services/fields.service.client'

@Component({
	selector: "form-builder-fields"
})
@View({
	templateUrl: "/assignment/views/forms/form-fields.view.html",
	directives: [RouterLink]
})

export class FieldsController {
	newFieldType: string
	newFieldMap: any
	formId: string
	fields: Array<any>
	fetching: boolean

	constructor(public stateService: StateService, public router: Router,
		public fieldsService: FieldsService, public http: Http, public params: RouteParams) {
		this.fetching = true
		this.newFieldMap = {
			"TEXT": { "id": null, "label": "New Text Field", "type": "TEXT", "placeholder": "New Field" },
			"TEXTAREA": { "id": null, "label": "New Text Field", "type": "TEXTAREA", "placeholder": "New Field" },
			"DATE": { "id": null, "label": "New Date Field", "type": "DATE" },
			"DROPDOWN": {
				"id": null, "label": "New Dropdown", "type": "OPTIONS", "options": [
					{ "label": "Option 1", "value": "OPTION_1" },
					{ "label": "Option 2", "value": "OPTION_2" },
					{ "label": "Option 3", "value": "OPTION_3" }
				]
			},
			"CHECKBOXES": {
				"id": null, "label": "New Checkboxes", "type": "CHECKBOXES", "options": [
					{ "label": "Option A", "value": "OPTION_A" },
					{ "label": "Option B", "value": "OPTION_B" },
					{ "label": "Option C", "value": "OPTION_C" }
				]
			},
			"RADIOS": {
				"id": null, "label": "New Radio Buttons", "type": "RADIOS", "options": [
					{ "label": "Option X", "value": "OPTION_X" },
					{ "label": "Option Y", "value": "OPTION_Y" },
					{ "label": "Option Z", "value": "OPTION_Z" }
				]
			}
		}
		this.formId = params.get('formId')
		fieldsService.getFieldsForForm(this.formId)
			.subscribe(resp => {
				this.fields = resp.json().fields
				this.fetching = false
			})

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
			})
	}

	deleteField(fieldId: string) {
		this.fieldsService.deleteFieldFromForm(this.formId, fieldId)
			.subscribe(resp => {
				this.fields = resp.json().fields
		})
	}
}