declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "dev" | "production" | "local" | "qa" | "test";
      PORT?: string;
      MONGO_URI: string;
      MONGO_DB_NAME: string;
      JWT_SECRET: string;
      JWT_EXPIRE: string;
      PROVIDER_URL: string;
      CHAIN_ID: number;
      PRIVATE_KEY: string;
      ADDRESS: string;
      EMAIL_HOST: string;
      EMAIL_PORT: string;
      EMAIL_USER: string;
      EMAIL_PASS: string;
      EMAIL_FROM: string;
      BELVO_SECRET_ID: string;
      BELVO_SECRET_PASSWORD: string;
      BELVO_ENV: string;
      TWILIO_ACCOUNT_SID: string;
      TWILIO_AUTH_TOKEN: string;
      DIALOGFLOW_PROJECT_ID: string;
      ZAP_SIGN_URL: string;
      ZAP_SIGN_TOKEN: string;
      ZAP_SIGN_SANDBOX: boolean;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
