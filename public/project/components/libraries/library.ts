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
		libraryService.get(libraryId)
			.subscribe(resp => {
				if (resp.json().library) {
					this.library = resp.json().library
				}
				this.fetchingLibrary = false
			})
	}

	hasEditRights() {
		return this.userService.getActiveUser() && this.library.user._id === this.userService.getActiveUser()._id
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
		this.libraryService.updateLibrary(this.library)
			.subscribe(resp => {
				if(resp.json().library) {
					this.library = resp.json().library
					this.libraryBackup = resp.json().library
				}
			})
	}

	removeMovie(id: string) {
		this.libraryService.removeMovie(this.library.id, id)
			.subscribe(resp => {
				if (resp.json().library) {
					this.library = resp.json().library
				}
			})
		//_.remove(this.library.movies, mov => { return mov.imdbId === id })
	}

}