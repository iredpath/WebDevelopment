import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { StateService } from '../../services/state.service.client'
import { User } from '../../models/user.model'
import { UserFactory } from '../../models/user.factory'

@Component({
	selector: "form-builder-login"
})

@View({
	templateUrl: "/assignment/views/users/login.view.html",
	directives: []
})

export class LoginController {

	user: any

	constructor(
		public userService:UserService, public stateService:StateService,
		public router:Router, public userFactory:UserFactory
	) {
		this.user = stateService.getActiveUser()
	}

	login() {
		this.userService.findUserByCredentials(this.user.username, this.user.password)
			.subscribe(resp => {
				const { user } = resp.json()
				if (user) {
					this.stateService.setActiveUser(user)
					this.router.navigate(['/Profile', {}])
				} else {
					alert('Invalid name/password')
					this.user = {}
				}
			})
	}
}