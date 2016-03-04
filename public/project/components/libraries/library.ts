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

	library: LibraryModel
	libraryBackup: LibraryModel
	fetchingLibrary: boolean
	isEditingLibraryName: boolean

	constructor(public params:RouteParams, public libraryService:LibraryService,
		public userService: UserService) {
		this.fetchingLibrary = true
		const libraryId: number = +params.get('library')
		this.library = libraryService.get(libraryId)
		this.fetchingLibrary = false
	}

	hasEditRights() {
		return this.userService.getActiveUser() && this.library.user.id === this.userService.getActiveUser().id
	}

	editLibraryName() {
		this.isEditingLibraryName = true
		this.libraryBackup = this.library
	}

	cancelEditingLibraryName() {
		this.isEditingLibraryName = false
		this.library = this.libraryBackup
	}

	saveNewLibraryName() {
		this.isEditingLibraryName = false
	}

	removeMovie(id: string) {
		_.remove(this.library.movies, mov => { return mov.imdbId === id })
	}

}