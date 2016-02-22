import { Component } from 'angular2/core';
import { Router, RouteConfig, ROUTER_DIRECTIVES } from 'angular2/router'

import { HomeController } from './home/home.controller'

@RouteConfig([
    { path: '/', component: HomeController, as: 'Home' }
])
@Component({
    selector: 'app-body',
    template: '<router-outlet></router-outlet>',
    directives: [ ROUTER_DIRECTIVES ]
})
export class Main { 
    
    constructor() {
        console.log("We are up and running!");
    }
    
}