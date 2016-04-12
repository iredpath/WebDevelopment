import { View, Component } from 'angular2/core'
import { UserService } from '../../services/user.service.client'

@Component({
	selector: "FormBuilder-Home"
})
@View({
	templateUrl: "/assignment/views/home/home.view.html"
})

export class HomeController {

	constructor(public userService: UserService) {
		userService.loggedIn()
			.subscribe(user => { user.json() && this.userService.setActiveUser(user.json()) })
	}

}