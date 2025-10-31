import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://9f70bfb766555f1c4ffa2e2d6e5dd6fb@o4510281285697537.ingest.us.sentry.io/4510281292513280",

  integrations: [
    Sentry.replayIntegration(),
  ],

  tracesSampleRate: 1.0,

  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  debug: false,
});
