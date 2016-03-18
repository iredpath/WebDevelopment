import { HeaderController } from '../views/header/header.controller'
import { SidebarController } from '../views/sidebar/sidebar.controller'
import { HomeController } from '../views/home/home.controller'
import { FormsController } from '../views/forms/forms.controller'
import { AdminController } from '../views/admin/admin.controller'
import { ProfileController } from '../views/users/profile.controller'
import { RegisterController } from '../views/users/register.controller'
import { LoginController } from '../views/users/login.controller'
import { FieldsController } from '../views/forms/fields.controller'

export const ROUTER_CONFIG = [
	{ path: '/home', component: HomeController, as: "Home", useAsDefault: true },
	{ path: '/forms', component: FormsController, as: "Forms" },
	{ path: '/admin', component: AdminController, as: "Admin" },
	{ path: '/profile', component: ProfileController, as: "Profile" },
	{ path: '/register', component: RegisterController, as: "Register" },
	{ path: '/login', component: LoginController, as: "Login" },
	{ path: '/form/:formId/field', component: FieldsController, as: 'Fields'}
]