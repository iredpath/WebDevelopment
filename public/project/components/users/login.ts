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
		this.username = ""
		this.password = ""
	}

	login() {
		this.userService.findUserByCredentials(this.username, this.password)
			.subscribe(
				resp => {
					if (resp.json().user) {
						this.userService.login(resp.json().user)
						this.router.navigate(['/Home', {}])
					} else {
						alert('Invalid name/password')
						this.username = ""
						this.password = ""
					}
				},
				err => { 
					alert(err.json().message)
					this.username = ""
					this.password = ""
				})
	}
}