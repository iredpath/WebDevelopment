import { View, Component } from 'angular2/core'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-home"
})
@View({
	templateUrl: "/project/components/home/home.view.html"
})

export class Home {
	constructor(public userService: UserService) {
		userService.loggedIn()
			.subscribe(resp => { resp.json() && resp.json().user && this.userService.setActiveUser(resp.json().user) })
	}
}