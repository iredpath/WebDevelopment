import { Injectable } from 'angular2/core'
import { MovieModel } from './movieModel'
import { UserModel } from './userModel'


@Injectable()
export class LibraryModel {

	id: number
	name: string
	movies: Array<MovieModel>
	comments: Array<any>
	ratings: Array<any>
	user: any


	constructor() { }

	static newLibrary(data:any) {
		let model: LibraryModel = new LibraryModel()
		model.configure(data)
		return model
	}

	static defaultLibrary(user: UserModel) {
		let model = new LibraryModel()
		model.user = user
		return model
	}

	configure(data:any) {
		this.id = data.id
		this.name = data.name
		this.movies = data.movies
		this.comments = data.comments
		this.ratings = data.ratings
		this.user = data.user
	}

}