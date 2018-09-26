import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';

import AuthRouter from './routes/AuthRouter';

const app = express();
app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "./views"));

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use('/auth', AuthRouter);

app.listen(3000);
console.log("Server started at localhost:3000");
