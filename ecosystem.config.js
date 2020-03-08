/* eslint-disable max-len */
module.exports = {
    apps: [{
        name: 'API',
        script: 'npm run start',
        autorestart: true,
        watch: false,
        env: {
            NODE_ENV: 'development'
        },
        env_production: {
            NODE_ENV: 'production',
            PORT: 9900,
            PG_HOST: '34.87.117.119',
            PG_PORT: 5432,
            PG_USER: 'postgres',
            PG_PASSWORD: 'password',
            PG_DB: 'carrental'
        },
        env_stagin: {
            NODE_ENV: 'stagin',
            PORT: 9900,
            PG_HOST: '34.87.117.119',
            PG_PORT: 5432,
            PG_USER: 'postgres',
            PG_PASSWORD: 'KQ2AF5fWmTErvfmW',
            PG_DB: 'uat-carrental'
        }
    }]
};
