const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const compress = require('compression');
//login
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const cors = require('cors');
const SequelizeStore = require("connect-session-sequelize")(session.Store);
//

const config = require('./config/config');
const port = config.server.port;
const app = express();

(async () => {
    const sequelize = await require('./models/sql/index');
    require('rootpath')();
    app.use(compress());
    app.use(flash());
    app.use(express.static('public'));
    app.use(cors({
        origin: [
            "http://localhost:4200"
        ],
        credentials: true
    }))
    app.use(express.urlencoded({
        extended: true
    }));
    app.use(express.json());
    app.use(express.json({
        "type": "application/fhir+json"
    }));
    app.use(express.text({
        "type": "text/*"
    }));
    app.use(express.raw({
        "type": "multipart/related",
        limit: "1000mb"
    }));
    app.use(express.raw({
        "type": "multipart/form-data",
        limit: "1000mb"
    }));
    app.use((err, req, res, next) => {
        // This check makes sure this is a JSON parsing issue, but it might be
        // coming from any middleware, not just body-parser:

        if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
            console.error(err);
            return res.sendStatus(400); // Bad request
        }

        next();
    });
    app.use(cookieParser('yx]P^uj0\\[zMR7p/'));
    //login
    app.use(session({
        secret: ')BXFm3W_saxy"4oP',
        resave: false,
        saveUninitialized: true,
        store: new SequelizeStore({
            db: sequelize
        }),
        httpOnly: true,
        proxy: true
    }));

    sequelize.sync();
    
    app.use(passport.initialize());
    app.use(passport.session());
    app.use((req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept ,Authorization");
        res.header("Vary", "Origin");
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE");
        res.header("Access-Control-Allow-Credentials", "true");
        next();
    });

    //login
    require('models/user/passport.js')(passport);
    require("routes.js")(app, passport);
    app.engine('html', require('ejs').renderFile);
    //
    http.createServer(app).listen(port, function () {
        console.log(`http server is listening on port:${port}`);
    });
})();

//module.exports = app;