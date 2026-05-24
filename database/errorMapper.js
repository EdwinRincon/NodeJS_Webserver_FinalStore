const mapMongoError = (error) => {
  // Handle MongoDB duplicate key error (error code 11000)
  if (error.code === 11000) {
    // Extract the field name from keyPattern or keyValue
    const keyPattern = error.keyPattern || {};
    const keyValue = error.keyValue || {};
    
    // Get the first key from either keyPattern or keyValue
    const duplicateField = Object.keys(keyPattern)[0] || Object.keys(keyValue)[0] || 'campo';
    
    return {
      status: 400,
      message: `${duplicateField} debe de ser único`,
    };
  }

  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const messages = Object.values(error.errors)
      .map((err) => err.message)
      .join(', ');
    
    return {
      status: 400,
      message: messages || 'Error de validación',
    };
  }

  // Handle cast errors
  if (error.name === 'CastError') {
    return {
      status: 400,
      message: `Formato inválido para ${error.path}`,
    };
  }

  // Default: pass through other errors unchanged
  return null;
};

module.exports = { mapMongoError };
