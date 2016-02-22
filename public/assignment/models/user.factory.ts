import { Injectable } from 'angular2/core'
import { User } from './user.model'

@Injectable()
export class UserFactory {

	newUser() {
		return new User()
	}

	static newUser() {
		return new User()
	}
}