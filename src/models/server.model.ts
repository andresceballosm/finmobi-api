import express, { Application } from "express";
import cors from "cors";

// DB
import { connectDB } from "../config/db.config";
import bodyParser from "body-parser";
const path = require("path");

class Server {
  private app: Application;
  private port: string;

  constructor() {
    this.app = express();
    this.port = process.env.PORT || "8000";
    //Headers
    this.headers();
    //DB
    this.dbConnection();
    //Middlewares
    this.middlewares();
    //Define routes
    this.routes();

    if (process.env.NODE_ENV !== "production") {
      require("dotenv").config();
    }
  }

  headers() {
    this.app.all("/*", function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
    });
  }

  async dbConnection() {
    await connectDB();
  }

  routes() {
    this.app.use("/api/v1/auth", require("../routes/auth.routes"));
    this.app.use("/api/v1/user", require("../routes/user.routes"));
    this.app.use("/api/v1/client", require("../routes/client.routes"));
    this.app.use("/api/v1/lease", require("../routes/lease.routes"));
    this.app.use("/api/v1/belvo", require("../routes/belvo.routes"));
    this.app.use("/api/v1/quote", require("../routes/quote.routes"));
    this.app.use("/api/v1/whatsapp", require("../routes/whatsapp.routes"));
    this.app.use("/api/v1/lease/cancellation", require("../routes/lease-cancellation.routes"));
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    //Static files
    this.app.use(express.static(path.join(__dirname, "public")));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log("Servidor corriendo en puerto " + this.port);
    });
  }
}

export default Server;
