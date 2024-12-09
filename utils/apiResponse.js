class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// const ApiResponse = (statusCode,status, message, data = null, errors = null) => {
//   return {statusCode, status, message, data, errors };
// };

export { ApiResponse }; 
 

