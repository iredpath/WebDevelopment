import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-register"
})

@View({
	templateUrl: "/project/components/users/register.view.html"
})

export class Register {

	user: any

	constructor(public userService: UserService, public router: Router) {
		this.user = {}
		this.userService.loggedIn()
			.subscribe(data => {
				if (data.json().user) {
					this.router.navigate(['/User', { user: data.json().user._id }])
				}
			})
	}

	register() {
		if (this.user.username && this.user.password && this.user.verifyPassword) {
			this.userService.createUser(this.user)
				.subscribe(resp => {
					if (resp.json().user) {
						// login
						this.userService.login(resp.json().user.username, resp.json().user.password)
							.subscribe(resp => {
								const data = resp.json()
								if (data && data.user) {
									const user = data.user
									this.userService.setActiveUser(user)
									this.router.navigate(['/Home', {}])
								}
							})
					}
				}, error => { alert(error._body) })
		} else {
			alert('make sure to enter at least a username and a password')
		}
	}
}