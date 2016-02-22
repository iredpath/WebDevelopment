import { View, Component } from 'angular2/core'
import { Router } from 'angular2/router'
import { StateService } from '../../services/state.service.client'
import { User } from '../../models/user.model'


@Component({
	selector: "form-builder-admin"
})
@View({
	templateUrl: "/assignment/views/admin/admin.view.html"
})

export class AdminController {

	user:User

	constructor(public stateService:StateService, public router:Router) {
		if (!stateService.isActiveUser()) {
			router.navigate(['/Login', {}])
		} else {
			this.user = stateService.getActiveUser()
		}
	}
}