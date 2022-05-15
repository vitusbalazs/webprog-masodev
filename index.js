import express from 'express';
import path from 'path';
import morgan from 'morgan';
import eformidable from 'express-formidable';
import { createTables } from './db/setupDB.js';
import listazas from './routes/listazas.js';
import details from './routes/details.js';
import advertisments from './routes/advertisments.js';
import users from './routes/users.js';

// a mappa ahonnan statikus tartalmat szolgálunk
const staticDir = path.join(process.cwd(), 'static');

// inicializáljuk az express alkalmazást
const app = express();

// morgan middleware: loggolja a beérkezett hívásokat
app.use(morgan('tiny'));

// formidable-lel dolgozzuk fel a kéréseket
app.use(eformidable({ staticDir }));

// view engine
app.set('view engine', 'ejs');

// create tables if they don't exist
createTables();

// routers
app.use('/ad', details);
app.use('/felhasznalo', users);
app.use('/hirdetesek', advertisments);
app.use('/', listazas);

// express static middleware: statikus állományokat szolgál fel
app.use(express.static(staticDir));

app.listen(8080, () => { console.log('Server listening on http://localhost:8080/ ...'); });
