import { View, Component, Inject } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/userService'

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
		this.userService.loggedIn()
			.subscribe(data => {
				if (data.json().user) {
					this.router.navigate(['/User', { user: data.json().user._id }])
				} else {
					this.username = ""
					this.password = ""
				}
			})
	}

	login() {
		if (this.username && this.password) {
			this.userService.login(this.username, this.password)
				.subscribe(
				resp => {
					const data = resp.json()
					if (data && data.user) {
						const user = data.user
						this.userService.setActiveUser(user)
						this.router.navigate(['/Home', {}])
					} else {
						alert('Invalid name/password')
						this.username = ""
						this.password = ""
					}
				},
				err => {
					console.log(err)
					alert(err._body)
					this.username = ""
					this.password = ""
				})
		} else {
			alert('please enter a username and password')
		}
	}
}