/**
 * Main config file used throughout the application
 * @module config
 * @type {object}
 * @property {integer} port - The port to expose to application to.
 * @property {string} pgUrl - The url used by sequlize to connect to postgres.
 * @property {string} nodeEnv - The environment to run the server in
 * @property {string} sentry - Sentry DSN

 */
const config = {
    endPoint: process.env.PRIVATE_USER_ENDPOINT || 'http://localhost:9100'
};
export default config;
