import * as express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'
import * as mongoose from 'mongoose'

import Userendpoints from './services/user.service.server'
import FormEndpoints from './services/form.service.server'
import FieldEndpoints from './services/field.service.server'
import UserModel from './models/user.model'
import FormModel from './models/form.model'

import Database from './project/data/database'
import UserSchema from './project/models/user.schema'
import LibrarySchema from './project/models/library.schema'
import MovieSchema from './project/models/movie.schema'
import RatingSchema from './project/models/rating.schema'
import CommentSchema from './project/models/comment.schema'
import UserModelProj from './project/models/user.model'
import LibraryModel from './project/models/library.model'
import MovieModel from './project/models/movie.model'
import CommentModel from './project/models/comment.model'
import RatingModel from './project/models/rating.model'

import LibraryEndpoints from './project/endpoints/libraryEndpoints'
import MovieEndpoints from './project/endpoints/movieEndpoints'
import UserEndpoints from './project/endpoints/userEndpoints'

const ipaddress:string = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const port:number = process.env.OPENSHIFT_NODEJS_PORT || 3000;
let mongoConnectionString: string = "mongodb://127.0.0.1:27017/webdevevelopment"
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
	const DB_USERNAME = process.env.OPENSHIFT_MONGODB_DB_USERNAME
	const DB_PASSWORD = process.env.OPENSHIFT_MONGODB_DB_PASSWORD
	const DB_HOST = process.env.OPENSHIFT_MONGODB_DB_HOST
	const DB_PORT = process.env.OPENSHIFT_MONGODB_DB_PORT
	const APP_NAME = process.env.OPENSHIFT_APP_NAME
	mongoConnectionString = `${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${APP_NAME}`
}

const db = mongoose.connect(mongoConnectionString)
let app = express();

app.use(bodyParser.json())
app.use(express.static(__dirname))

// initialize endpoints
const userModel = new UserModel(db)
Userendpoints(app, userModel)

const formModel = new FormModel(db)
FormEndpoints(app, formModel)
FieldEndpoints(app, formModel)

const userModelMongoose = mongoose.model('UserProj', LibrarySchema()) 
const libraryModelMongoose = mongoose.model('Library', LibrarySchema()) 
const movieModelMongoose = mongoose.model('Movie', LibrarySchema()) 
const ratingModelMongoose = mongoose.model('Rating', LibrarySchema()) 
const commentModelMongoose = mongoose.model('Comment', LibrarySchema())
const userModelProj = new UserModelProj(userModelMongoose, libraryModelMongoose, movieModelMongoose, ratingModelMongoose, commentModelMongoose)
const libraryModel = new LibraryModel(userModelMongoose, libraryModelMongoose, movieModelMongoose, ratingModelMongoose, commentModelMongoose)
const movieModel = new MovieModel(userModelMongoose, libraryModelMongoose, movieModelMongoose, ratingModelMongoose, commentModelMongoose)
const ratingModel = new RatingModel(userModelMongoose, libraryModelMongoose, movieModelMongoose, ratingModelMongoose, commentModelMongoose)
const commentModel = new CommentModel(userModelMongoose, libraryModelMongoose, movieModelMongoose, ratingModelMongoose, commentModelMongoose)
LibraryEndpoints(app, libraryModel)
MovieEndpoints(app, movieModel)
UserEndpoints(app, userModelProj)

app.listen(port, ipaddress, () => {
	console.log(`Server running at: ${ipaddress}:${port}`)
})
