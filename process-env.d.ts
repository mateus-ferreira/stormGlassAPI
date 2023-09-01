declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGOURL: string;
      APITOKEN: string;
      APIURL: string;
    }
  }
}

export {}