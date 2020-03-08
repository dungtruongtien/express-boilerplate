const config = {
    port: process.env.PORT || 9900,
    pgHost: process.env.PG_HOST || 'localhost',
    pgPort: process.env.PG_PORT || 5432,
    pgUser: process.env.PG_USER || 'postgres',
    pgPassword: process.env.PG_PASSWORD || 'password',
    pgDB: process.env.PG_DB || 'carrental',
    nodeEnv: process.env.NODE_ENV || 'development',
    sentry: process.env.SENTRY_DSN || '',
    jwtSecrect: process.env.JWT_KEY || 'sml#authen',
    encryptKey: process.env.ENCRYPT_KEY || 'sm-encrypt-secret-key',
    algorithmEncrypt: process.env.algorithmEncryp || 'aes-256-cbc',
    enableCORS: process.env.ENABLE_CORS || undefined
};
export default config;
