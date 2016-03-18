//import { Injectable } from 'angular2/core'

//@Injectable()
export class Form {

	_id:number
	userId:number
	title:string

	constructor() {
		this.title = "" 
	}

	setId(id: number) {
		this._id = id
	}

	setUserId(id:number) {
		this.userId = id
	}

	getId() { return this._id }
	getUserId() { return this.userId }
	getTitle() { return this.title }

	configure(formData:any) {
		this._id = formData._id
		this.userId = formData.userId
		this.title = formData.title
	}

}