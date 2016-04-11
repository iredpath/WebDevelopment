import { View, Component } from 'angular2/core'
import { RouteParams, RouterLink } from 'angular2/router'
import { LibraryModel } from '../../models/libraryModel'
import { LibraryService } from '../../services/libraryService'
import { UserService } from '../../services/userService'

@Component({
	selector: "vml-libraries"
})
@View({
	templateUrl: "/project/components/libraries/library.view.html",
	directives: [RouterLink]
})

export class Library {

	library: any
	backupName: any
	fetchingLibrary: boolean
	isEditingLibraryName: boolean
	newComment: string

	constructor(public params:RouteParams, public libraryService:LibraryService,
		public userService: UserService) {
		this.fetchingLibrary = true
		const libraryId: string = params.get('library')
		libraryService.get(libraryId)
			.subscribe(resp => {
				const data = resp.json().data
				if (data.library) {
					this.library = data.library
					this.library.user = data.user
					this.library.movies = data.movies
					this.library.comments = data.comments
					this.library.ratings = data.ratings
				}
				console.log(this.library)
				this.fetchingLibrary = false
			})
	}

	hasEditRights() {
		return this.userService.getActiveUser() && this.library.user._id === this.userService.getActiveUser()._id
	}

	editLibraryName() {
		this.isEditingLibraryName = true
		this.backupName = this.library.name
	}

	cancelEditingLibraryName() {
		this.isEditingLibraryName = false
		this.library.name = this.backupName
	}

	saveNewLibraryName() {
		this.isEditingLibraryName = false
		this.libraryService.updateLibrary(this.library)
			.subscribe(resp => {
				if(resp.json().library) {
					this.backupName = this.library.name
				}
			}, error => { alert(error.message) })
	}

	removeMovie(id: string) {
		this.libraryService.removeMovieFromLibrary(this.library._id, id)
			.subscribe(resp => {
				if (resp.json().library) {
					_.remove(this.library.movies, movie => { return (<any>movie)._id === id })
				}
			})
	}

	addComment() {
		if (this.newComment) {
			const comment = { comment: this.newComment,
				userId: this.userService.getActiveUser()._id,
				username: this.userService.getActiveUser().username,
				target: this.library._id
			}
			this.libraryService.addCommentToLibrary(this.library._id, comment)
				.subscribe(resp => {
					if (resp.json().comment) {
						this.library.comments.push(resp.json().comment)
						this.newComment = ""
					}
				})
		}
	}

}