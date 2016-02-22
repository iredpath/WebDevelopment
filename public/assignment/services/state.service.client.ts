import { Injectable } from 'angular2/core'
import { User } from '../models/user.model'
import { UserFactory } from '../models/user.factory'

@Injectable()
export class StateService {
	activeUser: User

	constructor(public userFactory:UserFactory) {
		this.activeUser = userFactory.newUser() 
	}
	setActiveUser(user) {
		this.activeUser = user
	}
	getActiveUser() {
		return this.activeUser
	}
	isActiveUser() {
		return !!this.activeUser.getId()
	}
	isActiveAdminUser() {
		return this.isActiveUser()
			&& _.includes(this.activeUser.getRoles(), "admin")
	}
}