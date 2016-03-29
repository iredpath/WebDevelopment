import * as express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'

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
let app = express();

app.use(bodyParser.json())
app.use(express.static(__dirname))

// initialize endpoints
const userModel = new UserModel()
Userendpoints(app, userModel)

const formModel = new FormModel()
FormEndpoints(app, formModel)
FieldEndpoints(app, formModel)

const db = new Database()
LibraryEndpoints(app, db)
MovieEndpoints(app, db)
UserEndpoints(app, db)

app.listen(port, ipaddress)
