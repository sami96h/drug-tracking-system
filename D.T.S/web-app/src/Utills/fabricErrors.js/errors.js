exports.NetworkConnectionError= class NetworkConnectionError extends Error {
	constructor(message) {
		super(message)
		this.name = 'NetworkConnectionError'
	}
}
  
exports.AuthenticationError=  class AuthenticationError extends Error {
	constructor(message) {
		super(message)
		this.name = 'AuthenticationError'
	}
}
  