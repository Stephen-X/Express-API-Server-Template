import { NextFunction, Request, Response, Router } from "express";

/**
 * Sub resource route class
 *
 * @author Stephen Tse <Stephen.Xie@sa.gov.au>
 * @version 1.0.0
 */
export class SubRoute {

    private static route = '/sub';

    /**
     * Add this route to the Router
     * @param router the main router object
     */
    public static addTo(router: Router): void {
        router.all(this.route, (req: Request, res: Response, next: NextFunction) => {
            res.json({
                name: 'Stephen Tse',
                email: 'Stephen.Xie@sa.gov.au',
                dept: 'DPTI',
                loc: 'Sub-resource page',
                query: req.query,  // query string passed in from URL
                workerPID: process.pid
            });
            next();
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
