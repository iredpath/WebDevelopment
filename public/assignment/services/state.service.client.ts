import { Injectable } from 'angular2/core'
import { User } from '../models/user.model'
import { UserFactory } from '../models/user.factory'

@Injectable()
export class StateService {
	activeUser: any

	constructor(public userFactory:UserFactory) {
		this.activeUser = {}
	}
	setActiveUser(user) {
		this.activeUser = user
	}
	getActiveUser() {
		return this.activeUser
	}
	isActiveUser() {
		return !!this.activeUser._id
	}
	isActiveAdminUser() {
		return this.isActiveUser()
			&& _.includes(this.activeUser.roles, "admin")
	}
}