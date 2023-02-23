const express = require('express');
const app = express();
const ejs = require('ejs');
const bodyParser = require('body-parser');
const colors = require('colors');
const ytdl = require('ytdl-core');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use('/main_page', express.static('./views/main_page'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/', async (req, res) => {
    let {
        domain
    } = req.body;
    if (!domain) return res.send('Youtube linki giriniz.');
    if (!ytdl.validateURL(domain)) return res.send('Youtube linki giriniz.');

    new Promise(async (resolve, reject) => {
        await ytdl(domain, {
            format: 'mp4',
            quality: 'highestvideo'
        }).pipe(res.attachment(`fast_videos_${Date.now()}.mp4`)).on('finish', () => {
            resolve();
        }).on('error', err => {
            reject(err);
        });
    }).then(() => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
        try {
            res.redirect('/');
        } catch (e) {
            console.log(e);
        }
    });
});

app.listen(80, () => {
    console.log('Fast Videos Aktif'.green);
});