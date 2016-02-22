import { View, Component } from 'angular2/core'
import { Form } from '../../models/form.model'
import { FormsService } from '../../services/forms.service.client'
import { StateService } from '../../services/state.service.client'

@Component({
	selector: "form-builder-forms"
})
@View({
	templateUrl: "/assignment/views/forms/forms.view.html"
})

export class FormsController {
	form:Form
	forms:Array<Form>

	constructor(public formsService:FormsService, public stateService:StateService) {
		this.form = new Form()
		formsService.findAllFormForUser(stateService.getActiveUser().getId(), forms => {
			this.forms = forms
		})
	}

	addForm() {
		const callback = form => console.log(`added form ${form} successfully`)
		const activeUser = this.stateService.getActiveUser()
		this.formsService.createFormForUser(activeUser.getId(), this.form, callback)
	}

	updateForm() {
		const callback = forms => this.forms = forms
		this.formsService.updateFormById(this.form.getId(), this.form, callback)
	}

	deleteForm(selected:Form) {
		if(selected.getId() === this.form.getId()) {
			this.form = new Form()
		}
		const callback = forms => this.forms = forms
		this.formsService.deleteFormById(selected.getId(), callback)
	}

	selectForm(selected:Form) {
		this.form = selected
	}
}