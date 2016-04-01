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
			if (resp.json().form) {
				this.forms.push(resp.json().form)
				this.form = {}
			} else {
				alert(resp.json().error)
			}
		}
		const activeUser = this.stateService.getActiveUser()
		this.form.userId = activeUser._id
		this.formsService.createFormForUser(activeUser._id, this.form)
			.subscribe(callback)
	}

	updateForm() {
		const callback = resp => {
			const form = resp.json().form
			if (resp.json().form) {
				this.forms = _.map(this.forms, f => {
					return f._id === form._id ? form : f
				})
				this.form = {}
			} else {
				alert(resp.json().error)
			}
		}
		this.formsService.updateFormById(this.form._id, this.form)
			.subscribe(callback)
	}

	deleteForm(selected) {
		if(selected._id === this.form._id) {
			this.form = {}
		}
		const callback = resp => {
			if (resp.json().form) {
				_.remove(this.forms, form => { return form._id === selected._id })
			} else {
				alert(resp.json().error)
			}
		}
		this.formsService.deleteFormById(selected._id)
			.subscribe(callback)
	}

	selectForm(selected) {
		this.form = selected
	}
}