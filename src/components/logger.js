/* eslint-disable import/prefer-default-export */
import { appLogger } from 'firis-service-sdk-test2/logger';
import config from '../config';

export const logger = appLogger(config.logLevel);
