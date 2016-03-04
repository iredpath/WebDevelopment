import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/userService'
import { UserModel } from '../../models/userModel'

@Component({
	selector: "vml-register"
})

@View({
	templateUrl: "/project/components/users/register.view.html"
})

export class Register {

	user: UserModel

	constructor(public userService: UserService, public router: Router) {
		this.user = UserModel.newUser({})
	}

	register() {
		this.userService.createUser(this.user, newUser => {
			if(newUser) {
				this.userService.login(newUser)
				this.router.navigate(['/Home', {}])
			} else {
				// assume invalid username
				alert('invalid username')
			}
		})
	}
}