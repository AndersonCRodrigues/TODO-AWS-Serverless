const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const { IS_LOCAL } = process.env;

const config = {
  region: 'us-east-1',
};

if (IS_LOCAL === 'true') config.endpoint = 'http://localhost:4566';

const client = new DynamoDBClient(config);

const dynamoDBClient = DynamoDBDocumentClient.from(client);

module.exports = {
  dynamoDBClient,
};