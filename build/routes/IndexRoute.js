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
        }).get(this.route, function (req, res, next) {
            // todo
            next();
        }).post(this.route, function (req, res, next) {
            // todo
            next();
        }).put(this.route, function (req, res, next) {
            // todo
            next();
        }).patch(this.route, function (req, res, next) {
            // todo
            next();
        }).delete(this.route, function (req, res, next) {
            // todo
            next();
        });
    };
    IndexRoute.route = '/';
    return IndexRoute;
}());
exports.IndexRoute = IndexRoute;
