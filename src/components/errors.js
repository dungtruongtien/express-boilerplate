import raven from 'raven';
import config from '../config';
import * as businessErrors from './ErrorInstance/businessErrors';

/**
* All error handeling and errors used trouought the application.
* @module components/errors
*/

/**
 * The sentry client used trought the application
 * @type {sentryClient}
 */
export const sentryClient = new raven.Client(config.sentry, {
    release: require('../../package.json').version,
    tags: {
        environment: config.nodeEnv
    }
});

/**
* handleError - sends the error to sentry to further analysis.
*
* @param  {Object} error - Validation error from  Sequelize
*/
export function handleError(error) {
    if (config.env === 'production' || config.env === 'staging') sentryClient.captureError(error);
}

const BusinessError = Object.keys(businessErrors).map(key => businessErrors[key].name);

// eslint-disable-next-line no-unused-vars
export function errorMiddleware(err, req, res, next) {
    if (BusinessError.indexOf(err.name) > -1) {
        res.status(err.status).send({
            name: err.name,
            message: err.message
        });
    }
}
