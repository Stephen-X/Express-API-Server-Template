import { Request, Response, Router } from "express";

/**
 * Index route class
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.0.0
 */
export class IndexRoute {

    private static route = '/';

    /**
     * Add this route to the Router
     * @param router the main router object
     */
    public static addTo(router: Router): void {
        router.all(this.route, (req: Request, res: Response) => {
            res.json({
                name: 'Stephen Tse',
                email: 'Stephen.Xie@sa.gov.au',
                dept: 'DPTI',
                loc: 'Index page',
                query: req.query,  // query string passed in from URL
                workerPID: process.pid
            });
        }).get(this.route, (req: Request, res: Response) => {
            // todo
        }).post(this.route, (req: Request, res: Response) => {
            // todo
        }).put(this.route, (req: Request, res: Response) => {
            // todo
        }).patch(this.route, (req: Request, res: Response) => {
            // todo
        }).delete(this.route, (req: Request, res: Response) => {
            // todo
        });
    }

}
