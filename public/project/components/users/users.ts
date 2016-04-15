import { View, Component } from 'angular2/core'
import { RouterLink } from 'angular2/router'
import { UserService } from '../../services/userService'
@Component({
	selector: "vml-users"
})
@View({
	templateUrl: "/project/components/users/users.view.html",
	directives: [RouterLink]
})

export class Users {
	users: Array<any>
	mostLibUsers: Array<any>
	mostRatingsUsers: Array<any>
	fetchingUsers: boolean
	showSearchResults: boolean
	results: Array<any>
	currentPage: number
	lastPage: number
	pages: Array<number>
	query: string

	constructor(public userService: UserService) {
		this.fetchingUsers = true
		userService.findAllUsers()
			.subscribe(resp => {
				if (resp.json().users) {
					this.users = resp.json().users
					this.mostLibUsers = this.calculateMostLibUsers()
					this.mostRatingsUsers = this.calculateMostRatingsUsers()
				}
				this.fetchingUsers = false
				this.showSearchResults = false
				this.query = ""
			})

	}
	calculateMostLibUsers() {
		return _.sortBy(this.users, user => {
			return user.libraries.length
		})// arbitrary, not sure what the best value here is
	}
	calculateMostRatingsUsers() {
		return _.sortBy(this.users, user => {
			return user.ratings.length
		})
	}

	search() {
		// bit of a misnomer, search is really more of a filter
		this.results = _.filter(this.users, user => {
			console.log(user)
			return user.username && user.username.indexOf(this.query) >= 0
				|| user.firstname && user.firstname.indexOf(this.query) >= 0
				|| user.lastname && user.lastname.indexOf(this.query) >= 0
				|| user.email && user.email.indexOf(this.query) >= 0
		})
		this.currentPage = 1
		this.lastPage = Math.ceil(this.results.length / 10)
		this.calculatePages()
		this.showSearchResults = true
	}
	calculatePages() {
		// Show 5 pages
		// When > 5 pages, show [curr - 2, curr + 2]
		const minPage = Math.max(1, Math.min(this.lastPage - 4, this.currentPage - 2))
		const maxPage = Math.min(this.lastPage, Math.max(5, this.currentPage + 2))
		this.pages = _.range(minPage, maxPage + 1)
	}

	getShownResults() {
		const start = 10 * (this.currentPage - 1)
		return this.results.slice(start, start + 10)
	}
	getResultsPage(page: number) {
		this.currentPage = page
	}


}