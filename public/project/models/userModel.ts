import { LibraryModel } from './libraryModel'

export class UserModel {

	id: number
	firstname: string
	lastname: string
	username: string
	password: string
	email: string
	libraries: Array<LibraryModel>

	constructor() {}

	static newUser(data:any) {
		let model: UserModel = new UserModel()
		model.libraries = []
		model.configure(data)
		return model
	}

	configure(data: any) {
		this.id = data._id
		this.firstname = data.firstname
		this.lastname = data.lastname
		this.username = data.username
		this.password = data.password
		this.email = data.email
		this.libraries = data.libraries
	}
}