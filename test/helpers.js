import sequelizeFixtures from 'sequelize-fixtures';
import path from 'path';
import db from '../src/models';


export function loadFixtures(fixtures) {
    const fixturePaths = fixtures
      .map(file => `${path.resolve(__dirname, '../')}/seeds/${file}.json`);
    return db
        .sequelize
        .sync({ force: true })
        .then(() => sequelizeFixtures.loadFiles(fixturePaths, db));
}

/**
 * getAllElements - Gives you one of the fixture elements of a given type
 *
 * @param {model} - Model you want to get elements from
 * @return {Array}  - All fixture elements form db
 */
export function getAllElements(model) {
    return db[model].findAll()
        .then(objects => objects.map(object => object.toJSON()));
}
