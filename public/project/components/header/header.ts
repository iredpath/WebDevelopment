import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location} from 'angular2/router'
import { UserService } from '../../services/userService'
import { Searchbar } from '../search/searchbar'

@Component({
	selector: "vml-header"
})
@View({
	templateUrl: "/project/components/header/header.view.html",
	directives: [Searchbar, RouterLink]
})
export class Header {
	location: Location

	constructor(public router: Router, location: Location, public userService: UserService) {
		this.location = location
	}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

	isActiveUser() {
		return !!this.userService.getActiveUser()
	}

	logout() {
		this.userService.logout()
		this.router.navigate(['/Home', {}])
	}
}
