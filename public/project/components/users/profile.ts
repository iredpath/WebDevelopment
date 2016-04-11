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
		if (!userService.getActiveUser()) {
			router.navigate(['/Login', {}])
		} else {
		this.fetchingUser = true
		const id: string = params.get('user')
		this.userService.getUserById(id)
			.subscribe(resp => {
				const data = resp.json().data
				if (data.user) {
					this.user = data.user
				} else {
					alert(`can't find user with id ${id}`)
				}
				this.fetchingUser = false
			})
		}
	}

	update() {
		this.userService.updateUser(this.user)
			.subscribe(resp => {
				const response = resp.json()
				if(response.user) {
					this.userService.login(response.user)
				} else if (response.error) {
					alert(response.error)
				}
			})
	}
}