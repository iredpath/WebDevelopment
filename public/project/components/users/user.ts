import { View, Component } from 'angular2/core'
import { RouteParams, Router, RouterLink } from 'angular2/router'
import { UserModel } from '../../models/userModel'
import { UserService } from '../../services/userService'
import { LibraryModel } from '../../models/libraryModel'
import { LibraryService } from '../../services/libraryService'

@Component({
	selector: "vml-user"
})

@View({
	templateUrl: "/project/components/users/user.view.html",
	directives: [RouterLink]
})

export class User {

	user: UserModel
	fetchingUser: boolean

	constructor(public params: RouteParams, public router: Router, 
		public userService: UserService, public libraryService: LibraryService) {
		this.fetchingUser = true
		const id: number = +params.get('user')
		this.user = userService.get(id)
		this.fetchingUser = false
	}

	hasEditRights() {
		return this.userService.getActiveUser() && this.user.id === this.userService.getActiveUser().id
	}

	newLibrary() {
		let newLib: LibraryModel = LibraryModel.defaultLibrary(this.user)
		newLib.id = new Date().getTime()
		newLib.name = this.getNextLibraryName()
		this.userService.addLibrary(newLib)
		this.router.navigate(["/Library", { library: newLib.id }])
	}

	getNextLibraryName() {
		const libraryNames = _.map(this.user.libraries, lib => { return lib.name })
		let baseName: string = "Untitled Library"
		let index: number = 0
		let nextName: string = baseName
		// TODO: fix this crap once my sanity returns
		while(true) {
			if (_.find(libraryNames, nextName)) {
				index++
				nextName = `${baseName}(${index})`
			} else {
				return nextName
			}
		}
	}

	getMovies() {
		return _.uniq(_.flatten(this.user.libraries))
	}
}