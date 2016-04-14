import { View, Component } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { User } from '../../models/user.model'

@Component({
	selector: "form-builder-profile"
})

@View({
	templateUrl: "/assignment/views/users/profile.view.html"
})

export class ProfileController {

	user: any
	loading: boolean

	constructor(public userService: UserService, public router: Router) {
		this.loading = true
		this.userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.user = user.json()
					this.user.password = "" // its encrypted, so we don't want it
					this.userService.setActiveUser(user.json())
					this.loading = false
				} else {
					router.navigate(['/Login', {}]) 
				}
		})
	}

	update() {
		if (this.user.password) {
			this.userService.updateUser(this.user._id, this.user)
				.subscribe(resp => {
					console.log("successfully updated user " + resp.json().user)
					this.userService.setActiveUser(resp.json().user)
				})
		} else {
			alert('Please enter a password before updating!')
		}
	}
}