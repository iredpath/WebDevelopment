import { View, Component } from 'angular2/core'
import { RouteParams, Router, RouterLink } from 'angular2/router'
import { UserService } from '../../services/userService'
import { LibraryService } from '../../services/libraryService'
import { MovieService } from '../../services/MovieService'

@Component({
	selector: "vml-user"
})

@View({
	templateUrl: "/project/components/users/user.view.html",
	directives: [RouterLink]
})

export class User {

	user: any
	newLibraryName: string
	fetchingUser: boolean

	constructor(public params: RouteParams, public router: Router, /*public movieService: MovieService,*/
		public userService: UserService, public libraryService: LibraryService) {
		this.fetchingUser = true
		const id: string = params.get('user')
		this.newLibraryName = ""
		this.userService.getUserById(id)
			.subscribe(resp => {
				if (resp.json().user) {
					this.user = resp.json().user
					console.log(this.user)
				} else {
					alert(`can't find user with id ${id}`)

				}
				this.fetchingUser = false
			})
	}

	hasEditRights() {
		return this.userService.getActiveUser() && this.user._id === this.userService.getActiveUser()._id
	}

	newLibrary() {
		if (this.newLibraryName) {
			let newLib: any = {}
			newLib.name = this.newLibraryName
			newLib.user = this.user._id
			this.libraryService.addLibrary(newLib)
				.subscribe(resp => {
					if (resp.json().library) {
						const id = resp.json().library._id
						this.user.libraries.push(resp.json().library)
						this.userService.login(this.user)
						this.router.navigate(["/Library", { library: id }])
					} else {
						alert(`error creating library ${this.newLibraryName}`)
					}
				}, error => { alert(error.message) })
		} else {
			alert("Make sure to name your library first!")
		}

	}

	removeLibrary(id: string) {
		this.userService.removeLibrary(id, this.userService.getActiveUser()._id)
			.subscribe(resp => {
				if (resp.json().user) {
					_.remove(this.user.libraries, lib => { return (<any>lib)._id === id })
				}
			})

	}
}