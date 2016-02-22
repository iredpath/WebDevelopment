/// <reference path="../../typings/browser.d.ts" />
import { bootstrap } from 'angular2/platform/browser'
import { provide, Component, View } from 'angular2/core'
import { RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES,
	LocationStrategy, HashLocationStrategy } from 'angular2/router'

import { HeaderController } from './views/header/header.controller'
import { SidebarController } from './views/sidebar/sidebar.controller'
import { ROUTER_CONFIG } from './router/config'
import { UserService } from './services/user.service.client'
import { StateService } from './services/state.service.client'
import { FormsService } from './services/forms.service.client'
import { UserFactory } from './models/user.factory'

@Component({
	selector: 'form-maker-app'
})
@View({
	templateUrl: './app.view.html',
	directives: [HeaderController, SidebarController, ROUTER_DIRECTIVES]
})
@RouteConfig(ROUTER_CONFIG)

class App {}

bootstrap(App, [UserService, StateService, FormsService, UserFactory,
	ROUTER_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })])