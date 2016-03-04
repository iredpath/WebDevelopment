import { View, Component } from 'angular2/core'
import { RouterLink, Router, Location } from 'angular2/router'

@Component({
	selector: "vml-sidebar"
})
@View({
	templateUrl: "/project/components/sidebar/sidebar.view.html",
	directives: [RouterLink]
})
export class Sidebar {
	location: Location

	constructor(public router: Router, location: Location) {
		this.location = location
	}

	isRouteActive(route) {
		return this.location.path().indexOf(route) > -1
	}

}