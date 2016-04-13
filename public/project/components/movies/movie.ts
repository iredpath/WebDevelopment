import { View, Component, Inject } from 'angular2/core'
import { RouteParams, RouterLink } from 'angular2/router'
import { MovieModel } from '../../models/movieModel'
import { OmdbMovieModel } from '../../models/omdbMovieModel'
import { LibraryModel } from '../../models/libraryModel'
import { OmdbService } from '../../services/omdbService'
import { MovieService } from '../../services/movieService'
import { LibraryService } from '../../services/libraryService'
import { UserService } from '../../services/userService'
import { RatingService } from '../../services/ratingService'
import { PosterService } from '../../services/posterService'

@Component({
	selector: "vml-movies"
})
@View({
	templateUrl: "/project/components/movies/movie.view.html",
	directives: [RouterLink]
})

export class Movie {

	user: any
	movie: any
	omdbMovie:OmdbMovieModel
	fetchingMovie:boolean
	fetchingLibraries: boolean
	libraryId: string
	possibleLibs: Array<any>
	myRating: number
	myRatingBackup: number
	avgRating: number

	constructor(public params:RouteParams, public omdbService:OmdbService,
		public movieService: MovieService, public libraryService: LibraryService,
		public userService: UserService, public ratingService: RatingService, public posterService: PosterService) {
		this.fetchingMovie = true
		this.fetchingLibraries = true
		this.userService.loggedIn()
			.subscribe(resp => {
				const data = resp.json()
				if (data.user) {
					// now we need the actual libraries
					this.libraryService.getLibrariesForUser(data.user._id)
						.subscribe(resp => {
							const dataLib = resp.json()
							if (dataLib.libraries) {
								const user = data.user
								user.libraries = dataLib.libraries
								this.userService.setActiveUser(user)
							}
						})
				}
			}, error => { alert(error) },
			() => {
				this.possibleLibs = []
				const imdbId: string = params.get('movie')
				omdbService.findMovieById(imdbId)
					.subscribe(
					data => {
						this.omdbMovie = OmdbMovieModel.newMovie(data.json())

						movieService.getOrCreate(imdbId, this.omdbMovie.title)
							.subscribe(resp => {
								const data = resp.json().data
								if (data.movie) {
									this.movie = data.movie
									this.movie.comments = data.comments
									this.movie.libraries = data.libraries
									this.movie.ratings = data.ratings
									this.userService.getActiveUser() && this.calculatePossibleLibs()
									this.calculateRatings()
									this.posterService.getPosterFor(this.movie)
										.subscribe(posterResp => {
											this.movie.image = `data:image/png;base64,${posterResp.text()}`
									}, error => { console.log(error) })
								} else {
									console.log('error fetching movie')
								}
								this.fetchingLibraries = false
								this.fetchingMovie = false
							})
					},
					err => { alert(err); this.omdbMovie = OmdbMovieModel.emptyMovie() })
			})
	}

	calculatePossibleLibs() {
		const userLibs = this.userService.getActiveUser().libraries
		console.log(this.movie)
		console.log(userLibs)
		this.possibleLibs =  _.filter(userLibs, lib => 
			{ return !_.some((<any>lib).movies, mov => { return mov === this.movie._id })
		})
	}
	
	addMovie() {
		if (this.libraryId) {
			this.movieService.addMovieToLibrary(this.movie._id, this.libraryId)
				.subscribe(resp => {
					const data = resp.json().data
					if (data.movie) {
						let libraries = this.movie.libraries
						libraries.push(data.libraries)
						this.movie = data.movie
						this.movie.libraries = libraries
						this.addMovieToUserLib(this.movie._id, this.libraryId)
						this.calculatePossibleLibs()	
					}
				}, error => { alert(error.message) })
		} else {
			alert("please select a library first")
		}

	}

	addMovieToUserLib(movieId: string, libraryId: string) {
		const user = this.userService.getActiveUser()
		const library: any = _.find(user.libraries, lib => { return (<any>lib)._id === libraryId })
		library.movies.push(movieId)
		this.libraryId = null
	}

	calculateRatings() {
		const user = this.userService.getActiveUser()
		let myRat
		if (user) {
			myRat = _.find(this.movie.ratings, rat => { return (<any>rat).userId === user._id })
		}
		this.myRating = myRat ? (<any>myRat).value : 0
		this.myRatingBackup = this.myRating
		this.avgRating = _.reduce(this.movie.ratings, (acc, rat) => { 
			return acc + (<any>rat).value }, 0) / this.movie.ratings.length || 0

		console.log(this.myRating)
		console.log(this.avgRating)
	}

	storeRating() {
		this.myRatingBackup = this.myRating
	}
	ratePreview(val: number) {
		//this.myRatingBackup = this.myRating
		this.myRating = val
	}

	clearPreview() {
		this.myRating = this.myRatingBackup
	}

	rate(val: number) {
		const user = this.userService.getActiveUser()
		if (user) {
			const myRat = _.find(this.movie.ratings, rat => { return (<any>rat).userId === user._id })
			if (myRat) { // update
				this.ratingService.updateRating((<any>myRat)._id, val)
					.subscribe(resp => {
						if (resp.json().rating) {
							const index = _.findIndex(this.movie.ratings, rat => { return rat === myRat })
							this.movie.ratings.splice(index, 1, resp.json().rating)
							this.calculateRatings()
						}
				})
			} else {
				const rating = { value: val, userId: user._id, target: this.movie._id }
				this.ratingService.createRating(rating)
					.subscribe(resp => {
						if (resp.json().rating) {
							this.movie.ratings.push(resp.json().rating)
							this.calculateRatings()
						}
				})
			}
		}
	}
	unrate() {
		const user = this.userService.getActiveUser()
		if (user) {
			const myRat = _.find(this.movie.ratings, rat => { return (<any>rat).userId === user._id })
			if (myRat) {
				this.ratingService.deleteRating((<any>myRat)._id)
				.subscribe(resp => {
					if (resp.json().rating) {
						_.remove(this.movie.ratings, rat => { return rat === myRat })
						this.calculateRatings()
					}
				})
			}
		}
	}
}