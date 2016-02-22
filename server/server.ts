import * as express from 'express'
import * as path from 'path'

const ipaddress:string = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const port:number = process.env.OPENSHIFT_NODEJS_PORT || 3000;
let app = express();

app.use(express.static(__dirname))

app.listen(port, ipaddress)
