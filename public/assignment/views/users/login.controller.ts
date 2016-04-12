import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { User } from '../../models/user.model'

@Component({
	selector: "form-builder-login"
})

@View({
	templateUrl: "/assignment/views/users/login.view.html",
	directives: []
})

export class LoginController {

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

	login() {
		this.userService.login(this.user.username, this.user.password)
			.subscribe(resp => {
				const user = resp.json()
				if (user) {
					this.userService.setActiveUser(user)
					this.router.navigate(['/Profile', {}])
				} else {
					alert('Invalid name/password')
					this.user = {}
				}
			}, err => {
				alert(err._body)
				this.user = {}
			})
	}
}