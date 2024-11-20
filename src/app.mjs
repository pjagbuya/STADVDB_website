

import express from "express"
import cookieParser from "cookie-parser";
import session from  "express-session";

const app = express();

// Over head template for using hbs
import handlebars from 'express-handlebars';
import bodyParser from 'body-parser';
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
}));
app.use(express.static('public'));

// Over head template for using sessions
app.use(cookieParser("Hello world"))
app.use(session({
    secret: "pjagbuya1234",
    saveUninitialized: false,
    resave: false,
    cooke:{
        maxAge: 60000 * 60 
    }
}))


// Code Proper
const PORT = process.env.PORT || 3000;

app.get('/', (req, res)=>{

    res.render('pages/home',{
        layout: 'home-layout',
        title: 'Welcome to STADVDB MCO2'
    });
    console.log(req.session)
    console.log(req.session.id)

})

app.get('/create', function(req, resp){


});

app.get('/read', (req, res)=>{
    response.status(201).send({msg:"Hello!"})

})
app.get('/update', (req, res)=>{
    response.status(201).send({msg:"Hello!"})

})

app.get('/delete', (req, res)=>{
    response.status(201).send({msg:"Hello!"})

})
