class ApiResponse {
  constructor(statusCode, data, message = "success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //memo in indusrty is given for status code
  }
}

export { ApiResponse }; 
