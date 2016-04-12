import { View, Component } from 'angular2/core'
import { Router, RouterLink } from 'angular2/router'
import { FormsService } from '../../services/forms.service.client'
import { UserService } from '../../services/User.service.client'

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

	constructor(public formsService:FormsService, public userService: UserService, public router:Router) {
		this.userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.userService.setActiveUser(user.json())
					this.form = {}
					formsService.findAllFormsForUser(user.json()._id)
						.subscribe(resp => {
							this.forms = resp.json().forms
					})
				} else {
					router.navigate(['/Login', {}]) 
				}
		})
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
		const activeUser = this.userService.getActiveUser()
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