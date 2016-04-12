import { View, Component } from 'angular2/core'
import { RouterLink, Location } from 'angular2/router'
import { UserService } from '../../services/user.service.client'

@Component({
	selector: "form-builder-sidebar"
})
@View({
	templateUrl: "/assignment/views/sidebar/sidebar.view.html",
	directives: [RouterLink]
})
export class SidebarController {
	location:Location

	constructor(public userService: UserService, location:Location) {
		this.location = location
	}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

	isActiveUser() {
		return this.userService.isActiveUser()
	}

	isActiveAdminUser() {
		return this.userService.isActiveAdminUser()
	}
}