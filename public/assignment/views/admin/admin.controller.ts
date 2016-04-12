import { View, Component } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'


@Component({
	selector: "form-builder-admin"
})
@View({
	templateUrl: "/assignment/views/admin/admin.view.html"
})

export class AdminController {

	user: any

	constructor(public userService: UserService, public router: Router) {
		userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.userService.setActiveUser(user.json())
					this.user = user.json()
				} else {
					router.navigate(['/Login', {}]) 
				}
		})
	}
}