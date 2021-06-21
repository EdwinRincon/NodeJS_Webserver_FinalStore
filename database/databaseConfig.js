const mongoose = require('mongoose');

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
    throw new Error('Error al iniciar la base de datos', error);
  }
};

module.exports = {
  dbConnection,
};
