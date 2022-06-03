import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import { existsSync, mkdirSync } from 'fs';
import cookieParser from 'cookie-parser';
import userJS from './routes/user.js';
import listJS from './routes/list.js';
import advertisementJS from './routes/advertisements.js';
import { connectDB } from './db/connectMongo.js';

// a mappa ahonnan statikus tartalmat szolgálunk
const staticDir = path.join(process.cwd(), 'static');
const uploadDir = path.join(staticDir, 'uploaded');

if (!existsSync(uploadDir)) {
    mkdirSync(uploadDir);
}

connectDB();

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));

// formidable-lel dolgozzuk fel a kéréseket
app.use(eformidable({ uploadDir }));
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// routers
app.use('/user', userJS);
app.use('/list', listJS);
app.use('/advertisement', advertisementJS);
app.use('/', listJS);

// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
