const { app } = require('./index');
require('dotenv').config();
const { createTodoTable } = require('./controllers/createTable');

const PORT = process.env.PORT || 3000;
const { USERS_TABLE } = process.env;

const params = {
  TableName: USERS_TABLE,
  AttributeDefinitions: [
    {
      AttributeName: 'taskId',
      AttributeType: 'S',
    },
  ],
  KeySchema: [
    {
      AttributeName: 'taskId',
      KeyType: 'HASH',
    },
  ],
  BillingMode: 'PAY_PER_REQUEST',
};

async function main() {
  await createTodoTable(params);
  app.listen(PORT, () => {
    console.log(`Server na porta ${PORT}`);
  });
}

main();