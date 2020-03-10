import Umzug from 'umzug';
import db from '../models';

export default function (sequlizeInstance) {
    return new Umzug({

        storage: 'sequelize',

        storageOptions: {
            sequelize: sequlizeInstance
        },

        migrations: {
            params: [
                sequlizeInstance.getQueryInterface(),
                sequlizeInstance.constructor,
                db,
                () => {
                    throw new Error(`Migration tried to use old style "done" callback.
                    Please upgrade to "umzug" and return a promise instead.`);
                }
            ],
            path: `${__dirname}/migrations/`,
            pattern: /\.migration.js$/
        }

    });
}
