"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Index route class
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.0.0
 */
var IndexRoute = (function () {
    function IndexRoute() {
    }
    /**
     * Add this route to the Router
     * @param router the main router object
     */
    IndexRoute.addTo = function (router) {
        router.all(this.route, function (req, res) {
            res.json({
                name: 'Stephen Tse',
                email: 'Stephen.Xie@sa.gov.au',
                dept: 'DPTI',
                loc: 'Index page',
                query: req.query,
                workerPID: process.pid
            });
        }).get(this.route, function (req, res) {
            // todo
        }).post(this.route, function (req, res) {
            // todo
        }).put(this.route, function (req, res) {
            // todo
        }).patch(this.route, function (req, res) {
            // todo
        }).delete(this.route, function (req, res) {
            // todo
        });
    };
    IndexRoute.route = '/';
    return IndexRoute;
}());
exports.IndexRoute = IndexRoute;
