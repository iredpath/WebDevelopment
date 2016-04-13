import { View, Component } from 'angular2/core'
import { Router } from 'angular2/router'
import { UserService } from '../../services/user.service.client'
import { AdminService } from '../../services/admin.service.client'


@Component({
	selector: "form-builder-admin"
})
@View({
	templateUrl: "/assignment/views/admin/admin.view.html"
})

export class AdminController {

	user: any
	users: Array<any>
	loading: boolean
	firstnameSorted: string
	lastnameSorted: string
	usernameSorted: string

	constructor(public userService: UserService, public adminService: AdminService, public router: Router) {
		this.loading = true
		userService.loggedIn()
			.subscribe(user => { 
				if (user.json()) {
					this.userService.setActiveUser(user.json())
					this.adminService.findAllUsers()
						.subscribe(resp => {
							if (resp.json().users) {
								this.users = resp.json().users
								this.user = {}
								this.firstnameSorted = 'asc'
								this.lastnameSorted = 'asc'
								this.usernameSorted = 'asc'
								this.loading = false
							}
						})
				} else {
					router.navigate(['/Login', {}]) 
				}
		})
	}

	sort(what, how) {
		this[`${what}Sorted`] = how
		console.log(this)
		this.users = _.sortBy(this.users, user => { return user[what] })
		console.log(this.users)
		if (how === 'asc') {
			this.users = this.users.reverse()
		}
	}
	createUser() {
		if (this.user._id) {
			alert('Please click the checkmark to update a user')
		} else {
			this.adminService.createUser(this.user)
				.subscribe(resp => {
					if (resp.json().user) {
						this.users.push(resp.json().user)
						this.user = {}
					}
				})
		}
	}

	updateUser() {
		if (!this.user._id) {
			alert('Please click the plus to create a new user')
		} else {
			this.adminService.updateUser(this.user._id, this.user)
				.subscribe(resp => {
					if (resp.json().user) {
						this.user = {}
					}
				})
		}
	}

	selectUser(u) {
		this.user = u
	}

	deleteUser(id: string) {
		this.adminService.deleteUserById(id)
			.subscribe(resp => {
				// did we just delete ourselves?
				if (id === this.userService.getActiveUser()._id) {
					// logout
					this.userService.logout()
						.subscribe(resp => {
							this.userService.clearActiveUser()
							this.router.navigate(['/Login', {}])
						})
				} else {
					this.user = {}
					_.remove(this.users, u => { return u._id === id })
				}
			})
	}
}