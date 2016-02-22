import { Injectable } from 'angular2/core'
import { User } from '../models/user.model'
import { UserFactory } from '../models/user.factory'

@Injectable()
export class UserService {

	users:Array<User>

	constructor(public userFactory:UserFactory) {

		const userData = [
  			{ "_id":123, "firstName":"Alice", "lastName":"Wonderland", "username":"alice",  "password":"alice",   "roles": ["student"] },
  			{ "_id":234, "firstName":"Bob", "lastName":"Hope", "username":"bob", "password":"bob", "roles": ["admin"] },
  			{ "_id":345, "firstName":"Charlie", "lastName":"Brown", "username":"charlie", "password":"charlie", "roles": ["faculty"] },
  			{ "_id":456, "firstName":"Dan", "lastName":"Craig", "username":"dan", "password":"dan", "roles": ["faculty", "admin"] },
  			{ "_id":567, "firstName":"Edward", "lastName":"Norton", "username":"ed", "password":"ed", "roles": ["student"] }
]
		// Create users based on userData
		this.users = _.map(userData, (userData) => {
			let user = this.userFactory.newUser()
			user.configure(userData)
			return user
		})
	}
	
	findUserByUsernameAndPassword(username, password, callback) {
		let user:User
		for(user of this.users) {
			if(user.getUsername() === username && user.getPassword() === password) {
				callback(user)
				return
			}
		}
		callback(null)
	}

	findAllUsers(callback) {
		callback(this.users)
	}

	createUser(user, callback) {
		user.setId((new Date).getTime())
		this.users.push(user)
		callback(user)
	}

	deleteUserById(userId, callback) {
		callback(_.remove(this.users, user => { user.getId() === userId }))
	}

	updateUser(userId, user, callback) {
		callback(_.forEach(this.users, oldUser => { 
			if(user._id === userId) {
				oldUser = user
				return
			}
		}))
	}
}