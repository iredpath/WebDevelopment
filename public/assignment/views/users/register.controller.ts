import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { StateService } from '../../services/state.service.client'
import { User } from '../../models/user.model'

@Component({
	selector: "form-builder-register"
})

@View({
	templateUrl: "/assignment/views/users/register.view.html"
})

export class RegisterController {

	user: any

	constructor(
		public userService:UserService, public stateService:StateService,
		public router:Router
	) {
		this.user = stateService.getActiveUser()
	}

	register() {
		this.userService.createUser(this.user)
			.subscribe(resp => {
				const { user } = resp.json()
				console.log('successfully created user ' + user)
				this.stateService.setActiveUser(user)
				this.router.navigate(['/Profile', {}])
			})
	}
}