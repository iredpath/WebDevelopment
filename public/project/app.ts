/// <reference path="../../typings/browser.d.ts" />
import { bootstrap } from 'angular2/platform/browser'
import { provide, Component, View } from 'angular2/core'
import { RouteConfig, ROUTER_PROVIDERS, ROUTER_DIRECTIVES,
LocationStrategy, HashLocationStrategy, RouteParams } from 'angular2/router'
import { HTTP_PROVIDERS } from 'angular2/http'

import { Header } from './components/header/header'
import { Sidebar } from './components/sidebar/sidebar'
import { ROUTER_CONFIG } from './router/config'
import { OmdbService } from './services/omdbService'
import { LibraryService } from './services/libraryService'
import { MovieService } from './services/movieService'
import { UserService } from './services/userService'
import { ResultsService } from './services/resultsService'
import { RatingService } from './services/ratingService'

@Component({
	selector: 'vml-app'
})
@View({
	templateUrl: './app.view.html',
	directives: [Header, Sidebar, ROUTER_DIRECTIVES]
})
@RouteConfig(ROUTER_CONFIG)

class App { }

bootstrap(App, [ROUTER_PROVIDERS, OmdbService, LibraryService, MovieService, UserService, ResultsService, RatingService,
	HTTP_PROVIDERS, provide(LocationStrategy, { useClass: HashLocationStrategy })])