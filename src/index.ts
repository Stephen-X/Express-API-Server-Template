import { Server } from './Server';

// define port of the server (TODO: port 443 requires admin priviledge;
// use port > 1000 in testing if you don't have admin access)
const PORT = 3000;

const server = Server.bootstrap(PORT);
