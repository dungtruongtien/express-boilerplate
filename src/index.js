import { migrateDB } from './db-helpers';
import app from './app';
import config from './config';

function listen() {
    app.listen(config.port, () => {
        console.log('Express server listening on %d, in %s mode', // eslint-disable-line
            config.port, app.get('env'));
    });
}

const db = migrateDB()
    .catch(err => console.log('DB ERROR', err));

db.then(() => listen());
