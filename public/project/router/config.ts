import { Home } from '../components/home/home'
import { Libraries } from '../components/libraries/libraries'
import { Library } from '../components/libraries/library'
import { Movies } from '../components/movies/movies'
import { Movie } from '../components/movies/movie'
import { Register } from '../components/users/register'
import { Login } from '../components/users/login'
import { User } from '../components/users/user'
import { Users } from '../components/users/users'
import { Profile } from '../components/users/profile'

export const ROUTER_CONFIG = [
	{ path: '/home', component: Home, as: "Home", useAsDefault: true },
	{ path: '/libraries', component: Libraries, as: 'Libraries' },
	{ path: '/libraries/:library', component: Library, as: 'Library' },
	{ path: '/movies', component: Movies, as: 'Movies' },
	{ path: '/movies/:movie', component: Movie, as: 'Movie' },
	{ path: '/register', component: Register, as: 'Register' },
	{ path: '/login', component: Login, as: 'Login'},
	{ path: '/users', component: Users, as: 'Users' },
	{ path: '/users/:user', component: User, as: 'User' },
	{ path: '/users/:user/details', component: Profile, as: 'Details' }
]