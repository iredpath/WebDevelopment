import { Injectable } from 'angular2/core'

@Injectable()
export class User {

	_id:number
	username:string
	password:string
	firstName:string
	lastName:string
	email:string
	roles:Array<string>

	constructor() {
		this.username = "" 
		this.password = ""
		this.firstName = ""
		this.lastName = ""
		this.email = ""
		this.roles = []
	}

	setId(id: number) {
		this._id = id
	}

	getId() { return this._id }
	getUsername() { return this.username }
	getPassword() { return this.password }
	getFirstName() { return this.firstName }
	getLastName() { return this.lastName }
	getEmail() { return this.email }
	getRoles() { return this.roles }

	configure(userData:any) {
		this._id = userData._id
		this.username = userData.username
		this.password = userData.password
		this.firstName = userData.firstName
		this.lastName = userData.lastName
		this.email = userData.email
		this.roles = userData.roles
	}

}