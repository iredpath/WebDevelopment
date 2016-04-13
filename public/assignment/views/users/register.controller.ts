import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { User } from '../../models/user.model'

@Component({
	selector: "form-builder-register"
})

@View({
	templateUrl: "/assignment/views/users/register.view.html"
})

export class RegisterController {

	user: any

	constructor(public userService:UserService, public router:Router) {
		this.user = {}
		userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.router.navigate(['/Profile', {}])
				}
			})
	}

	register() {
		this.user.role = "admin"
		this.userService.createUser(this.user)
			.subscribe(resp => {
				if (resp.json().user) {
					// login
					this.userService.login(resp.json().user.username, resp.json().user.password)
						.subscribe(resp => {
							this.router.navigate(['/Profile', {}])
						})	
				}
			})
	}
}