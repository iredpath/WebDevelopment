import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location } from 'angular2/router'
import { StateService } from '../../services/state.service.client'
import { UserFactory } from '../../models/user.factory'

@Component({
	selector: "form-builder-header"
})
@View({
	templateUrl: "/assignment/views/header/header.view.html",
	directives: [RouterLink]
})
export class HeaderController {
	location:Location

	constructor(public userFactory:UserFactory, public stateService:StateService,
		public router:Router, location:Location) {
		this.location = location
	}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

	isActiveUser() {
		return this.stateService.isActiveUser()
	}

	isActiveAdminUser() {
		return this.stateService.isActiveAdminUser()
	}

	logout() {
		this.stateService.setActiveUser({})
		this.router.navigate(['/Home', {}])
	}
}