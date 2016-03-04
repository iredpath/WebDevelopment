import { View, Component } from 'angular2/core'
import { RouteParams, Router, Location } from 'angular2/router'

@Component({
	selector: "vml-searchbar"
})

@View({
	templateUrl: "/project/components/search/searchbar.view.html"
})

export class Searchbar {
	query: string

	constructor(public router: Router, location: Location) {
		// get the query data from the route if we're looking at results
		const regexMatch: Array<string> = location.path().match("/?query=(.*?)$")
		this.query = regexMatch ? regexMatch[1] : ""
	}

	onKeyup() {}

	search() {
		this.router.navigate(['/Results', { query: this.query }])
	}
}