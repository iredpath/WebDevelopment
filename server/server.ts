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

const db_proj = new Database()
LibraryEndpoints(app, db_proj)
MovieEndpoints(app, db_proj)
UserEndpoints(app, db_proj)

app.listen(port, ipaddress, () => {
	console.log(`Server running at: ${ipaddress}:${port}`)
})
