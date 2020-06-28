import bodyParser from 'body-parser';
import compression from 'compression';
import express from 'express';
import cors from 'cors';
import { ConvertRoute } from './convert_route';
//import path from 'path';



const app = express();


app.set("port", 46100);

app.use(compression(/*{
    threshold: 0, // or whatever you want the lower threshold to be
    filter: (_req, _res) => {
        // var ct = res.get('content-type');
        // return `true` for content types that you want to compress,
        // `false` otherwise
        return true;
    }
}*/
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



const logErrors = (err: Error, _req: express.Request, _res: express.Response, next: any) => {
    next(err);
}

const clientErrorHandler = (err: Error, req: express.Request, res: express.Response, next: any) => {
    if (req.xhr) {
        res.status(500).send({ error: 'XHR failure' })
    } else {
        next(err)
    }
}

const errorHandler = (err: Error, _req: express.Request, res: express.Response, _next: any) => {
    res.status(500);
    res.render('error', { error: err });
}


app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

/*
// TODO: understand these better before enabling
app.use(flash());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});
*/




var healthRouter = express.Router();
healthRouter.get('/', (_req, res) => {

    res.status(200);
    res.contentType("json");
    res.send({ "status": "healthy" });
    res.end();
});
app.use('/health', healthRouter);


//app.use('/', express.static('public'))

const convertRoute = new ConvertRoute();
const convertRouter = express.Router();
convertRouter.use(cors());
convertRouter.post(
    '/',
    convertRoute.serve.bind(convertRoute));

app.use('/api/convert', convertRouter);


/*
var htmlContentRouter = express.Router();
htmlContentRouter.get("/", (_req, res) => {
    res.contentType("html");
    res.sendFile(path.join(__dirname, '../../src/sky.html'));
});
app.use('/', htmlContentRouter);
*/

/**
 * Start Express server.
 */


const server = app.listen(app.get("port"), () => {
    console.log(
        "  App is running at http://localhost:%d ",
        app.get("port")
    );
    console.log("  Press CTRL-C to stop\n");
});




export default server;