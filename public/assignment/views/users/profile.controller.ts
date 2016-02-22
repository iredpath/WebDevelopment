import { View, Component } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { StateService } from '../../services/state.service.client'
import { User } from '../../models/user.model'

@Component({
	selector: "form-builder-profile"
})

@View({
	templateUrl: "/assignment/views/users/profile.view.html"
})

export class ProfileController {

	user: User

	constructor(public userService: UserService, public stateService: StateService, public router: Router) {
		if (!stateService.isActiveUser()) {
			router.navigate(['/Login', {}])
		} else {
			this.user = stateService.getActiveUser()
		}
	}

	update() {
		this.userService.updateUser(this.user.getId(), this.user, resp => {
			console.log("successfully updated user " + resp)
		})
	}
}