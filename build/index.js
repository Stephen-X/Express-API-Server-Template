"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Server_1 = require("./Server");
// define port of the server (TODO: port 443 requires admin priviledge;
// use port > 1000 in testing if you don't have admin access)
var PORT = 3000;
var server = Server_1.Server.bootstrap(PORT);
