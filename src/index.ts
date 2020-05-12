/* Config typeorm */
import "reflect-metadata";
import { createConnection } from "typeorm";

import express from 'express';
require('dotenv/config')

import bodyParser from "body-parser";
import helmet from "helmet";
import cors from "cors";

import routes from './routes';


//Connects to the Database -> then starts the express
createConnection()
  .then(async connection => {
    // Create a new express application instance
    const app = express();

    // Call midlewares
    app.use(cors());
    app.use(helmet());
    app.use(bodyParser.json());

    //Set all routes from routes folder
    app.use("/", routes);

    app.listen(process.env.PORT || 7000, () => {
      console.log("Server started on port 7000!");
    });
  })
  .catch(error => console.log(error));