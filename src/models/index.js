/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import config from '../config';

const logging = config.nodeEnv === 'development' ? console.log : false; // eslint-disable-line
const capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

const sequelize = new Sequelize(
    {
        dialect: 'postgres',
        username: config.pgUser,
        password: config.pgPassword,
        database: config.pgDB,
        host: config.pgHost,
        port: config.pgPort,
        logging
    }
);

const db = fs
    .readdirSync(__dirname)
    .filter(filename => /model.js$/.test(filename))
    .reduce((total, filename) => {
        const model = sequelize.import(path.resolve(__dirname, filename));
        total[capitalize(model.name)] = model;
        return total;
    }, {});

/**
 * Sets up the associations for each model.
 * @param  {string} modelName
 */
Object.keys(db).forEach(modelName => {
    if ('associate' in db[modelName]) {
        db[modelName].associate(db);
    }
});

const total = {
    sequelize,
    Sequelize,
    ...db
};

export default total;
