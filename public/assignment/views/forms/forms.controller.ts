import { View, Component } from 'angular2/core'
import { Router, RouterLink } from 'angular2/router'
import { FormsService } from '../../services/forms.service.client'
import { StateService } from '../../services/state.service.client'

@Component({
	selector: "form-builder-forms"
})
@View({
	templateUrl: "/assignment/views/forms/forms.view.html",
	directives: [RouterLink]
})

export class FormsController {
	form
	forms:Array<any>

	constructor(public formsService:FormsService, public stateService:StateService, public router:Router) {
		if (!stateService.isActiveUser()) {
			router.navigate(['/Login', {}])
		} else {
			this.form = {}
			formsService.findAllFormsForUser(stateService.getActiveUser()._id)
				.subscribe(resp => {
					this.forms = resp.json().forms
			})
		}
	}

	addForm() {
		const callback = resp => {
			this.forms = resp.json().forms
			this.form = {}
		}
		const activeUser = this.stateService.getActiveUser()
		this.form.userId = activeUser._id
		this.formsService.createFormForUser(activeUser._id, this.form)
			.subscribe(callback)
	}

	updateForm() {
		const callback = resp => this.forms = resp.json().forms
		this.formsService.updateFormById(this.form._id, this.form)
			.subscribe(callback)
	}

	deleteForm(selected) {
		console.log(selected)
		if(selected._id === this.form._id) {
			this.form = {}
		}
		const callback = resp => this.forms = resp.json().forms
		this.formsService.deleteFormById(selected._id)
			.subscribe(callback)
	}

	selectForm(selected) {
		this.form = selected
	}
}