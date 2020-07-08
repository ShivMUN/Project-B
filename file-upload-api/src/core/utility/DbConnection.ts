import mongoose from "mongoose";
import bluebird from "bluebird";
mongoose.Promise = bluebird;

const dbConnection = (() => {

  const connect = ({ connectionUri = "", configurations = {} } = {}) => {
    return mongoose.connect(connectionUri, configurations);
  };

  const disConnect = () => {
    return mongoose.disconnect();
  };

  return {
    connect,
    disConnect
  };


})();


export default dbConnection;
