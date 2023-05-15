const { ListTablesCommand, CreateTableCommand } = require('@aws-sdk/client-dynamodb');
require('dotenv').config();
const { dynamoDBClient } = require('../dynamoDB');

const { USERS_TABLE } = process.env;

async function createTodoTable(params) {
  try {
    const { TableNames } = await dynamoDBClient.send(new ListTablesCommand({}));

    if (!TableNames.includes(USERS_TABLE)) {
      await dynamoDBClient.send(new CreateTableCommand(params));
      console.log('Tabela Criada!');
    } else {
      console.log('Tabela já existe!');
    }
  } catch (e) {
    console.log(`Deu ruim: ${e}`);
  }
}

module.exports = { createTodoTable };