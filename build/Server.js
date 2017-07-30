"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bodyParser = require("body-parser");
var cluster = require("cluster");
var compression = require("compression");
var cors = require("cors");
var express = require("express");
var fs_1 = require("fs");
var helmet = require("helmet");
var http = require("http");
var https = require("https");
var os_1 = require("os");
var IndexRoute_1 = require("./routes/IndexRoute");
var SubRoute_1 = require("./routes/SubRoute");
/**
 * The main server class.
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.2.0
 */
var Server = (function () {
    function Server(port) {
        this.cpuInfo = os_1.cpus(); // info of each CPU core of this computer
        this.httpsOptions = {
            cert: fs_1.readFileSync("./certs/cert.pem"),
            key: fs_1.readFileSync("./certs/key.pem")
        };
        port === 443 ? this.url = "https://localhost" : this.url = "https://localhost:" + port;
        this.app = express();
        this.addConfig();
        this.appendRoutes();
        this.clusterConfig(port);
    }
    /**
     * Provide a static method to bootstrap a new server.
     * @param port port of the server
     */
    Server.bootstrap = function (port) {
        return new Server(port);
    };
    /**
     * Add configurations and middlewares to the current server app.
     * Note: CORS doesn't work on HTTPS domain with self-signed certs.
     */
    Server.prototype.addConfig = function () {
        var corsOptions = {
            allowedHeaders: ['Content-Type', 'Authorization'],
            method: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
            origin: [this.url],
        };
        this.app.use(helmet());
        // add some security measures against common attacks to the server: https://helmetjs.github.io/docs/
        this.app.options('*', cors(corsOptions)); // enable CORS pre-flight for all resources
        this.app.use(cors({ origin: [this.url] }));
        // HTTP access control (CORS): https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
        // Notice: disable CORS if you use self-signed certs to test HTTPS functionality
        this.app.set("json spaces", 4); // prettify JSON string output with indentation (just for demonstration)
        this.app.use(bodyParser.json()); // enable JSON parsing
        this.app.use(compression()); // compress all responses to save some throughput
    };
    /**
     * Create and append a REST router with preconfigured routes to the application.
     */
    Server.prototype.appendRoutes = function () {
        var router = express.Router();
        // adding routes to router
        IndexRoute_1.IndexRoute.addTo(router);
        SubRoute_1.SubRoute.addTo(router);
        // appending the configured router middleware to the main application
        this.app.use(router);
    };
    /**
     * Configure master and worker servers.
     */
    Server.prototype.clusterConfig = function (port) {
        var _this = this;
        if (cluster.isMaster) {
            // create workers based on the number of CPU cores
            this.cpuInfo.forEach(function () { return _this.createAWorker(); });
            // listen to messages sent by workers
            cluster.on('message', function (worker, message) {
                console.log("Worker (pid: %d) returned this message: %s", worker.process.pid, message);
            });
            // monitor workers' health
            cluster.on('exit', function (worker) {
                console.log("Worker (pid: " + worker.process.pid + ") is dead. Starting a new one...");
                _this.createAWorker();
            });
        }
        else {
            process.send("I'm up!");
            // bang as non-null assertion operator:
            // https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#non-null-assertion-operator
            https.createServer(this.httpsOptions, this.app)
                .listen(port, function () {
                console.log("API Server (Worker pid: " + process.pid + ") is up - visit " + _this.url);
            });
            // redirect HTTP domain to the HTTPS one
            // TODO: port 80 requires admin priviledge; use port > 1000 in testing if you don't have admin access
            http.createServer(function (req, res) {
                console.log("Redirecting HTTP domain to HTTPS...");
                res.writeHead(301, { Location: _this.url + req.url });
                res.write("Redirecting to HTTPS domain...");
                res.end();
            }).listen(4000);
        }
    };
    /**
     * Used by master node to create a new worker process.
     */
    Server.prototype.createAWorker = function () {
        var worker = cluster.fork();
        console.log("Created worker with pid: " + worker.process.pid);
    };
    return Server;
}());
exports.Server = Server;
