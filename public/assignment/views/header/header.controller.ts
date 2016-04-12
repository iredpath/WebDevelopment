import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location } from 'angular2/router'
import { UserService } from '../../services/user.service.client'

@Component({
	selector: "form-builder-header"
})
@View({
	templateUrl: "/assignment/views/header/header.view.html",
	directives: [RouterLink]
})
export class HeaderController {

	constructor(public userService: UserService, public router:Router, public location:Location) {}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

	isActiveUser() {
		return this.userService.isActiveUser()
	}

	isActiveAdminUser() {
		return this.userService.isActiveAdminUser()
	}

	logout() {
		this.userService.logout()
			.subscribe(resp => {
				this.userService.clearActiveUser()
				this.router.navigate(['/Home', {}])
			})
	}
}