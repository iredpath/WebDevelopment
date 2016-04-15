import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location} from 'angular2/router'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-header"
})
@View({
	templateUrl: "/project/components/header/header.view.html",
	directives: [RouterLink]
})
export class Header {
	location: Location

	constructor(public router: Router, location: Location, public userService: UserService) {
		this.location = location
	}

	isLoginRouteActive() {
		return this.location.path().indexOf('login') > -1
	}

	isRegisterRouteActive() {
		return this.location.path().indexOf('register') > -1
	}

	isDetailsRouteActive() {
		return this.isActiveUser()
			&& this.location.path().indexOf('details') > -1
			&& this.location.path().indexOf(this.userService.getActiveUser()._id) > -1
	}

	isProfileRouteActive() {
		return this.isActiveUser()
			&& this.location.path().indexOf('user') > -1
			&& this.location.path().indexOf(this.userService.getActiveUser()._id) > -1
			&& !this.isDetailsRouteActive()
	}

	isActiveUser() {
		return !!this.userService.getActiveUser()
	}

	logout() {
		this.userService.logout()
			.subscribe(resp => {
				if (resp.json()) {
					this.userService.clearActiveUser()
					this.router.navigate(['/Home', {}])
				}
			}, error => { alert(error) })
	}
}
