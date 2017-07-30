import * as bodyParser from "body-parser";
import * as cluster from "cluster";
import * as compression from "compression";
import * as cors from "cors";
import * as express from "express";
import { readFileSync } from "fs";
import * as helmet from "helmet";
import * as http from "http";
import * as https from "https";
import { cpus } from "os";
import { IndexRoute } from "./routes/IndexRoute";
import { SubRoute } from "./routes/SubRoute";

/**
 * The main server class.
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.2.0
 */
export class Server {

    /**
     * Provide a static method to bootstrap a new server.
     * @param port port of the server
     */
    public static bootstrap(port: number): Server {
        return new Server(port);
    }

    public app: express.Application;
    private cpuInfo = cpus();  // info of each CPU core of this computer
    private httpsOptions = {  // cert config for the HTTPS server
        cert: readFileSync("./certs/cert.pem"),
        key: readFileSync("./certs/key.pem")
    };
    private url: string;

    constructor(port: number) {
        port === 443 ? this.url = `https://localhost` : this.url = `https://localhost:${port}`;
        this.app = express();
        this.addConfig();
        this.appendRoutes();
        this.clusterConfig(port);
    }

    /**
     * Add configurations and middlewares to the current server app.
     * Note: CORS doesn't work on HTTPS domain with self-signed certs.
     */
    private addConfig(): void {
        const corsOptions = {  // CORS configuration
            allowedHeaders: ['Content-Type', 'Authorization'],  // controls the Access-Control-Allow-Headers header
            method: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],  // controls the Access-Control-Allow-Methods header
            origin: [ this.url ],  // controls the Access-Control-Allow-Origin header
        };

        this.app.use(helmet());
        // add some security measures against common attacks to the server: https://helmetjs.github.io/docs/
        this.app.options('*', cors(corsOptions));  // enable CORS pre-flight for all resources
        this.app.use(cors({ origin: [this.url] }));
        // HTTP access control (CORS): https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
        // Notice: disable CORS if you use self-signed certs to test HTTPS functionality
        this.app.set("json spaces", 4);  // prettify JSON string output with indentation (just for demonstration)
        this.app.use(bodyParser.json());  // enable JSON parsing
        this.app.use(compression());  // compress all responses to save some throughput
    }

    /**
     * Create and append a REST router with preconfigured routes to the application.
     */
    private appendRoutes(): void {
        const router: express.Router = express.Router();

        // adding routes to router
        IndexRoute.addTo(router);
        SubRoute.addTo(router);

        // appending the configured router middleware to the main application
        this.app.use(router);
    }

    /**
     * Configure master and worker servers.
     */
    private clusterConfig(port: number): void {
        if (cluster.isMaster) {
            // create workers based on the number of CPU cores
            this.cpuInfo.forEach(() => this.createAWorker());

            // listen to messages sent by workers
            cluster.on('message', (worker: cluster.Worker, message: string) => {
                console.log("Worker (pid: %d) returned this message: %s", worker.process.pid, message);
            });

            // monitor workers' health
            cluster.on('exit', (worker: cluster.Worker) => {
                console.log(`Worker (pid: ${worker.process.pid}) is dead. Starting a new one...`);
                this.createAWorker();
            });

        } else {
            process.send!("I'm up!");
            // bang as non-null assertion operator:
            // https://github.com/Microsoft/TypeScript/wiki/What's-new-in-TypeScript#non-null-assertion-operator

            https.createServer(this.httpsOptions, this.app)
                .listen(port, () => {  // assign port and start the server
                    console.log(`API Server (Worker pid: ${process.pid}) is up - visit ${this.url}`);
                });

            // redirect HTTP domain to the HTTPS one
            // TODO: port 80 requires admin priviledge; use port > 1000 in testing if you don't have admin access
            http.createServer((req: express.Request, res: express.Response) => {
                console.log("Redirecting HTTP domain to HTTPS...");
                res.writeHead(301, { Location: this.url + req.url});
                res.write("Redirecting to HTTPS domain...");
                res.end();
            }).listen(4000);

        }
    }

    /**
     * Used by master node to create a new worker process.
     */
    private createAWorker(): void {
        const worker = cluster.fork();
        console.log(`Created worker with pid: ${worker.process.pid}`);
    }

}
