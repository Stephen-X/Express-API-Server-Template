"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Sub resource route class
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.0.0
 */
var SubRoute = (function () {
    function SubRoute() {
    }
    /**
     * Add this route to the Router
     * @param router the main router object
     */
    SubRoute.addTo = function (router) {
        router.all(this.route, function (req, res, next) {
            res.json({
                name: 'Stephen Tse',
                email: 'Stephen.Xie@sa.gov.au',
                dept: 'DPTI',
                loc: 'Sub-resource page',
                query: req.query,
                workerPID: process.pid
            });
            next();
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
    SubRoute.route = '/sub';
    return SubRoute;
}());
exports.SubRoute = SubRoute;
