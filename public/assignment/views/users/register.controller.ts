import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { StateService } from '../../services/state.service.client'
import { User } from '../../models/user.model'
import { UserFactory } from '../../models/user.factory'

@Component({
	selector: "form-builder-register"
})

@View({
	templateUrl: "/assignment/views/users/register.view.html"
})

export class RegisterController {

	user:User

	constructor(
		public userService:UserService, public stateService:StateService,
		public router:Router, public userFactory:UserFactory
	) {
		this.user = stateService.getActiveUser()
	}

	register() {
		this.userService.createUser(this.user, resp => {
			console.log('successfully created user ' + resp)
			this.stateService.setActiveUser(resp)
			this.router.navigate(['/Profile', {}])
		})
	}
}