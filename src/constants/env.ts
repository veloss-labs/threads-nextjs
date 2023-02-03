const ENV = process.env.NODE_ENV;
const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID;
const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
const DEPLOY_GROUP = process.env.NEXT_PUBLIC_DEPLOY_GROUP;

export const environment = ENV;
export const siteURL = SITE_URL;
export const apiHost = API_HOST;
export const gaTrackingID = GA_TRACKING_ID;
export const sentryDSN = SENTRY_DSN;
export const deployGroup = DEPLOY_GROUP;
