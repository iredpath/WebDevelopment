import { View, Component, Inject } from 'angular2/core'
import { Router, RouteParams } from 'angular2/router'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-profile"
})

@View({
	templateUrl: "/project/components/users/profile.view.html"
})

export class Profile {

	user: any
	fetchingUser: boolean

	constructor(public userService: UserService, public router: Router, public params: RouteParams) {
		this.fetchingUser = true
		this.userService.loggedIn()
			.subscribe(resp => {
				const data = resp.json()
				if (data.user && this.isUsersPage(data.user._id)) {
					this.user = data.user
					this.userService.setActiveUser(this.user)
					this.fetchingUser = false
				} else {
					router.navigate(['/Login', {}])
				}
			}, err => { alert(err) })
	}

	isUsersPage(id: string) {
		return id === this.params.get('user')
	}

	update() {
		if (this.user.username && this.user.password && this.user.verifyPassword) {
			this.userService.updateUser(this.user)
				.subscribe(resp => {
					const response = resp.json()
					if (response.user) {
						this.userService.setActiveUser(response.user)
					} else if (response.error) {
						alert(response.error)
					}
				})
		} else {
			alert('don\'t delete username or password')
		}
	}
}