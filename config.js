/*
*
*  create and export configuration variables
*
*/
var environments = {};

//Staging (default) environment
environments.staging = {
  'httpPort' : 3000,
  'httpsPort': 3001,
  'envName': 'staging'
};

//production environment
environments.production = {
  'httpPort' : 5000,
  'httpsPort': 5001,
  'envName': 'production'
};
//Determine which argument is passed as a command-line-argument
var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//check the current environment is one of the above, if not default to staging!!
var environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;

//export the module
module.exports = environmentToExport;
