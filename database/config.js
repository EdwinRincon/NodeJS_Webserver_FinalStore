const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    const URI = process.env.URLDB;

    await mongoose.connect(URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error al iniciar la base de datos");
  }
};


module.exports = {
    dbConnection
}