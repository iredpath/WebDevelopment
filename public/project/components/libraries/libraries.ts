import { View, Component } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { LibraryModel } from '../../models/libraryModel'
import { LibraryService } from '../../services/libraryService'

@Component({
	selector: "vml-libraries"
})
@View({
	templateUrl: "/project/components/libraries/libraries.view.html",
	directives: [RouterLink]
})

export class Libraries {
	fetchingLibraries: boolean
	libraries: Array<LibraryModel>

	constructor(public libraryService: LibraryService) {
		this.fetchingLibraries = true
		libraryService.getAll()
			.subscribe(resp => {
				if (resp.json().libraries) {
					this.libraries = resp.json().libraries
				}
				this.fetchingLibraries = false
			})

	}
}