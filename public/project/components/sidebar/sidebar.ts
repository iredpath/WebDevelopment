import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location } from 'angular2/router'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-sidebar"
})
@View({
	templateUrl: "/project/components/sidebar/sidebar.view.html",
	directives: [RouterLink]
})
export class Sidebar {

	constructor(public router: Router, public location: Location, public userService: UserService) {
	}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

	isUsersRouteActive() {
		return this.location.path().indexOf('users') > -1
			&& this.notViewingSelf()
	}

	notViewingSelf() {
		return !this.userService.isActiveUser()
			|| this.location.path().indexOf(this.userService.getActiveUser()._id) === -1
	}

	isMoviesRouteActive() {
		return this.location.path().indexOf('movies') > -1
	}

	isLibrariesRouteActive() {
		return this.location.path().indexOf('libraries') > -1
	}

}