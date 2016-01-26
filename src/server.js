import express from 'express';

const ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
const port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

let app = express();

app.use(express.static(`${__dirname}/../public`));

app.get('/hello', (req, res) => {
  res.send('hello world');
});

app.listen(port, ipaddress);