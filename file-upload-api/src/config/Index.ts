// All configurations will extend these options
// ============================================

const configFactory: any = {
  apiName: "fileUploadServer",
  env: process.env.NODE_ENV,
  // Server port
  port: process.env.PORT,

  // Server protocol
  protocol: process.env.PROTOCOL,

  // Server host
  host: process.env.HOST,

  // Server IP
  ip: process.env.IP,

  // Domain (e.g. https://localhost)
  domain: process.env.DOMAIN,

  filePath: "../public",

  // MongoDB connection options
  mongo: {
    options: {
      // https://mongoosejs.com/docs/deprecations.html
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: false,
      reconnectTries: 30,
      reconnectInterval: 500, // in ms
    },
    db: process.env.MONGODB_DB_NAME,
    useMongoClient: true,
    connectionUri: `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB_NAME}`,
  }
};


export default configFactory;