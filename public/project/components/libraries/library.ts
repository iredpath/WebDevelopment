import { View, Component } from 'angular2/core'
import { RouteParams, RouterLink } from 'angular2/router'
import { LibraryModel } from '../../models/libraryModel'
import { LibraryService } from '../../services/libraryService'
import { UserService } from '../../services/userService'
import { RatingService } from '../../services/ratingService'

@Component({
	selector: "vml-libraries"
})
@View({
	templateUrl: "/project/components/libraries/library.view.html",
	directives: [RouterLink]
})

export class Library {

	library: any
	backupName: any
	fetchingLibrary: boolean
	isEditingLibraryName: boolean
	newComment: string
	editCommentText: string
	editCommentId: string
	avgRating: number
	myRating: number
	myRatingBackup: number


	constructor(public params:RouteParams, public libraryService:LibraryService,
		public userService: UserService, public ratingService: RatingService) {
		this.fetchingLibrary = true
		this.userService.loggedIn()
			.subscribe(data => {
				if (data.json().user) {
					this.userService.setActiveUser(data.json().user)
				}
			}, error => { alert(error) },
				() => {
					const libraryId: string = params.get('library')
					libraryService.get(libraryId)
						.subscribe(resp => {
							const data = resp.json().data
							if (data.library) {
								this.library = data.library
								this.library.user = data.user
								this.library.movies = data.movies
								this.library.comments = data.comments
								this.library.ratings = data.ratings
							}
							this.calculateRatings()
							console.log(this.library)
							this.fetchingLibrary = false
						})
				})
		
	}

	calculateRatings() {
		const user = this.userService.getActiveUser()
		let myRat
		if (user) {
			myRat = _.find(this.library.ratings, rat => { return (<any>rat).userId === user._id })
		}
		this.myRating = myRat ? (<any>myRat).value : 0
		this.myRatingBackup = this.myRating
		this.avgRating = _.reduce(this.library.ratings, (acc, rat) => { 
			return acc + (<any>rat).value }, 0) / this.library.ratings.length || 0

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
			const myRat = _.find(this.library.ratings, rat => { return (<any>rat).userId === user._id })
			if (myRat) { // update
				this.ratingService.updateRating((<any>myRat)._id, val)
					.subscribe(resp => {
						if (resp.json().rating) {
							const index = _.findIndex(this.library.ratings, rat => { return rat === myRat })
							this.library.ratings.splice(index, 1, resp.json().rating)
							this.calculateRatings()
						}
				})
			} else {
				const rating = { value: val, userId: user._id, target: this.library._id }
				this.ratingService.createRating(rating)
					.subscribe(resp => {
						if (resp.json().rating) {
							this.library.ratings.push(resp.json().rating)
							this.calculateRatings()
						}
				})
			}
		}
	}
	unrate() {
		const user = this.userService.getActiveUser()
		if (user) {
			const myRat = _.find(this.library.ratings, rat => { return (<any>rat).userId === user._id })
			if (myRat) {
			this.ratingService.deleteRating((<any>myRat)._id)
				.subscribe(resp => {
					if (resp.json().rating) {
						_.remove(this.library.ratings, rat => { return rat === myRat })
						this.calculateRatings()
					}
				})
			}
		}
	}
	hasEditRights() {
		return this.userService.hasEditRights(this.library.user._id)
	}

	editLibraryName() {
		this.isEditingLibraryName = true
		this.backupName = this.library.name
	}

	cancelEditingLibraryName() {
		this.isEditingLibraryName = false
		this.library.name = this.backupName
	}

	saveNewLibraryName() {
		this.isEditingLibraryName = false
		this.libraryService.updateLibrary({ name: this.library.name })
			.subscribe(resp => {
				if(resp.json().library) {
					this.backupName = this.library.name
				}
			}, error => { alert(error.message) })
	}

	removeMovie(id: string) {
		this.libraryService.removeMovieFromLibrary(this.library._id, id)
			.subscribe(resp => {
				if (resp.json().library) {
					_.remove(this.library.movies, movie => { return (<any>movie)._id === id })
				}
			})
	}

	addComment() {
		const user = this.userService.getActiveUser()
		if (this.newComment && user) {
			const comment = { comment: this.newComment,
				userId: user._id,
				username: user.username,
				target: this.library._id
			}
			this.libraryService.addCommentToLibrary(this.library._id, comment)
				.subscribe(resp => {
					if (resp.json().comment) {
						this.library.comments.push(resp.json().comment)
						this.newComment = ""
					}
				})
		}
	}

	isEditingComment(id: string) {
		return id === this.editCommentId
	}

	editComment(comment: any) {
		if (this.userService.getActiveUser() && this.userService.getActiveUser()._id === comment.userId) {
			this.editCommentId = comment._id
			this.editCommentText = (<any>comment).comment
		}
	}

	saveEditComment() {
		this.libraryService.editCommentForLibrary(this.library._id, this.editCommentId, this.editCommentText)
			.subscribe(resp => {
				if (resp.json().comment) {
					const comm: any = _.find(this.library.comments, c => { return (<any>c)._id === this.editCommentId })
					comm.comment = resp.json().comment.comment
					comm.date = resp.json().comment.date
					comm.edited = resp.json().comment.edited
					this.cancelEditComment()
				}
			})
	}

	cancelEditComment() {
		this.editCommentId = null
		this.editCommentText = ""
	}

	getRowRange() {
		return _.range(this.library.movies.length / 4)
	}

	getCommentDate(datenum: number) {
		const date = new Date(datenum)
		const year = date.getUTCFullYear()
		const month = date.getUTCMonth()
		const day = date.getUTCDay()
		const hour = date.getUTCHours()
		const minutes = date.getUTCMinutes()
		const seconds = date.getUTCSeconds()

		const dateNow = new Date()
		const yearNow = dateNow.getUTCFullYear()
		const monthNow = dateNow.getUTCMonth()
		const dayNow = dateNow.getUTCDay()
		const hourNow = dateNow.getUTCHours()
		const minutesNow = dateNow.getUTCMinutes()
		const secondsNow = dateNow.getUTCSeconds()

		if (year !== yearNow) {
			const diff = yearNow - year
			return `${diff} year${diff === 1 ? "" : 's'} ago`
		} else if (month !== monthNow) {
			const diff = monthNow - month
			return `${diff} month${diff === 1 ? "" : 's'} ago`
		} else if (day !== dayNow) {
			const diff = dayNow - day
			return `${diff} day${diff === 1 ? "" : 's'} ago`
		} else if (hour !== hourNow) {
			const diff = hourNow - hour
			return `${diff} hour${diff === 1 ? "" : 's'} ago`
		} else if (minutes !== minutesNow) {
			const diff = minutesNow - minutes
			return `${diff} minute${diff === 1 ? "" : 's'} ago`
		} else {
			const diff = secondsNow - seconds
			return `${diff} second${diff === 1 ? "" : 's'} ago`
		}
		//return new Date(datenum)
	}

}