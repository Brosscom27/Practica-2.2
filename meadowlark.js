import express from 'express';
import {engine} from 'express-handlebars';
import dotenv from 'dotenv';
import path from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const app = express();
const port = process.env.PORT || 8000 
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const images = {
    'image1': {
        ruta: '/images/bea.jpg',
        url: 'https://www.tuexpertoapps.com/wp-content/uploads/2020/07/bea.jpg'
    },
    'image2': {
        ruta: '/images/brock.jpg',
        url: 'https://media.vandal.net/m/1-2019/2019122062580_2.jpg'
    },
    'image3':{
        ruta: '/images/Emz.png',
        url: 'https://brawlstarsonline.com/wp-content/uploads/2021/02/EMZ-Brawl-Stars-1-946x1536.png'
    },
    'image4':{
        ruta: '/images/nani.png',
        url: 'https://www.chillbs.com/wp-content/uploads/2020/05/nuevo-brawler.png'
    },
    'image5' :{
        ruta: '/images/surge.png',
        url: 'https://imagenesparapeques.com/wp-content/uploads/2020/12/Surge-Brawl-Stars.png'
    }
}

app.engine('handlebars', engine({
        defaultLayout: 'main',
}));


app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get("/Mario", (req, res) =>{
    const keys = Object.keys(images);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const imageData = images[randomKey];
    res.render('Mario', { image: imageData.ruta, url: imageData.url });
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
