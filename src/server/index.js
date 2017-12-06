'use strict';

let path            = require('path'),
    express         = require('express'),
    bodyParser      = require('body-parser'),
    logger          = require('morgan'),
    session         = require('express-session'),
    mongoose        = require('mongoose');

mongoose.Promise = global.Promise;
let port = process.env.PORT ? process.env.PORT : 8080;
let env = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';

let app = express();
app.use(express.static(path.join(__dirname, '../../public')));
if (env !== 'test') app.use(logger('dev'));
app.engine('pug', require('pug').__express);
app.set('views', __dirname);

app.use(session({
    name: 'session',
    secret: 'secretlbw',
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/',
        httpOnly: false,
        secure: false
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let options = {
    useMongoClient: true
};

//mongoose.connect('mongodb://192.168.99.100:32768/lbw', options)
mongoose.connect('mongodb://127.0.0.1:27017', options)
    .then(() => {
        console.log('\t MongoDB connected');

        // Import our Data 
        app.models = {
            User: require('./models/user'),
            GoalList: require('./models/goals'),
			Post: require('./models/posts'),
			Stat: require('./models/statuses'),
        };

        // Import our API Routes
        require('./api/v1/user')(app);
        require('./api/v1/session')(app);
		require('./api/v1/goals')(app);
		require('./api/v1/posts')(app);
		require('./api/v1/statuses')(app);

        // Give them the SPA base page
        app.get('*', (req, res) => {
            let preloadedState = req.session.user ? {
                username: req.session.user.username,
                primary_email: req.session.user.primary_email
            } : {};
            preloadedState = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
            res.render('base.pug', {
                state: preloadedState
            });
        });
    }, err => {
        console.log(err);
    });


let server = app.listen(port, () => {
    console.log('Love In A Big World app listening on ' + server.address().port);
});
