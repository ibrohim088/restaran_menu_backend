const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Serverda xatolik yuz berdi',
  });
};

export default errorHandler;
