import express from 'express';
import {engine} from 'express-handlebars';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 8000 

app.engine('handlebars', engine({
        defaultLayout: 'main',
}));

app.set('view engine', 'handlebars');

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/Roberto', (req, res) => {
    res.render('roberto');
});

app.use((req, res) =>{
    res.status(404);
    res.render('404');
});

app.use((req, res) =>{
    res.status(5000);
    res.render('500');
});


app.listen(port, () =>{
    console.log("listening successful");
}); 
