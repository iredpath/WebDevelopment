import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/userService'
import { UserModel } from '../../models/userModel'

@Component({
	selector: "vml-login"
})

@View({
	templateUrl: "/project/components/users/login.view.html"
})

export class Login {

	username: string
	password: string

	constructor(public userService: UserService, public router: Router) {
		this.username = ""
		this.password = ""
	}

	login() {
		this.userService.findUserByCredentials(this.username, this.password, resp => {
			if (resp) {
				this.userService.login(resp)
				this.router.navigate(['/Home', {}])
			} else {
				alert('Invalid name/password')
				this.username = ""
				this.password = ""
			}
		})
	}
}