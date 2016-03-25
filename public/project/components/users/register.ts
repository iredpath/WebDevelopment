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
	}

	register() {
		this.userService.createUser(this.user)
			.subscribe(resp => {
				const response = resp.json()
				if(response.user) {
					this.userService.login(response.user)
					this.router.navigate(['/Home', {}])
				} else if (response.error) {
					alert(response.error)
				}
			})
	}
}