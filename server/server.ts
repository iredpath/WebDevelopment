import * as express from 'express'
import * as path from 'path'
import * as bodyParser from 'body-parser'

import UserEndpoints from './services/user.service.server'
import FormEndpoints from './services/form.service.server'
import FieldEndpoints from './services/field.service.server'
import UserModel from './models/user.model'
import FormModel from './models/form.model'

const ipaddress:string = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const port:number = process.env.OPENSHIFT_NODEJS_PORT || 3000;
let app = express();

app.use(bodyParser.json())
app.use(express.static(__dirname))

// initialize endpoints
const userModel = new UserModel()
UserEndpoints(app, userModel)

const formModel = new FormModel()
FormEndpoints(app, formModel)
FieldEndpoints(app, formModel)

app.listen(port, ipaddress)
