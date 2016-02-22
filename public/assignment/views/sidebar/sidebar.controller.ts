import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location } from 'angular2/router'
import { StateService } from '../../services/state.service.client'
import { UserFactory } from '../../models/user.factory'

@Component({
	selector: "form-builder-sidebar"
})
@View({
	templateUrl: "/assignment/views/sidebar/sidebar.view.html",
	directives: [RouterLink]
})
export class SidebarController {
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
}