/* eslint-disable max-lines-per-function */
require('dotenv').config();
const {
  ScanCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
 } = require('@aws-sdk/client-dynamodb');
const { v4: uuidv4 } = require('uuid');
const { dynamoDBClient } = require('../dynamoDB');

const { USERS_TABLE } = process.env;

async function getAll(_req, res) {
  const params = {
    TableName: USERS_TABLE,
  };

  try {
    const { Items } = await dynamoDBClient.send(new ScanCommand(params)); // get na tabela passada por params

    res.status(200).json(Items);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function create(req, res) {
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(401).json({ message: 'tá errado!' });
  }

  const data = new Date().toLocaleString().substring(0, 10);

  const convertDate = new Date(date).toLocaleString().substring(0, 10);

  const params = {
    TableName: USERS_TABLE,
    Item: {
      taskId: { S: uuidv4() },
      title: { S: title },
      description: { S: description },
      date: { S: convertDate },
      createdAt: { S: data },
      status: { BOOL: false },
    },
  };

  try {
    await dynamoDBClient.send(new PutItemCommand(params));

    res.status(201).json({ message: 'Criado com sucesso!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function getOne(req, res) {
  const { id } = req.params;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      taskId: { S: id },
    },
  };

  try {
    const { Item } = await dynamoDBClient.send(new GetItemCommand(params));
    res.status(200).json(Item);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function update(req, res) {
  const { id } = req.params;
  const { title, description, date } = req.body;

  if (!title || !description || !date) {
    return res.status(401).json({ message: 'tá errado!' });
  }

  const convertDate = new Date(date).toLocaleString().substring(0, 10);

  const params = {
    TableName: USERS_TABLE,
    Key: {
      taskId: { S: id },
    },
    UpdateExpression: 'SET title = :title, description = :description, #dd = :date', // expressão de update
    ExpressionAttributeNames: { // como renomer atributos no dynamoDB
      '#dd': 'date',
    },
    ExpressionAttributeValues: { // seta valore inclusos na expressão
      ':title': { S: title },
      ':description': { S: description },
      ':date': { S: convertDate },
    },
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));

    res.status(200).json({ message: 'Update com sucesso!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function updateStatus(req, res) {
  const { id } = req.params;

  const paramsFind = {
    TableName: USERS_TABLE,
    Key: {
      taskId: { S: id },
    },
  };

  const { Item } = await dynamoDBClient.send(new GetItemCommand(paramsFind));

  const { status } = Item;

  const getBool = status.BOOL;

  const params = {
    TableName: USERS_TABLE,
    Key: {
      taskId: { S: id },
    },
    UpdateExpression: 'SET #st = :status', // expressão de update
    ExpressionAttributeNames: {
      '#st': 'status',
    },
    ExpressionAttributeValues: { // seta valore inclusos na expressão
      ':status': { BOOL: !getBool },
    },
  };

  try {
    await dynamoDBClient.send(new UpdateItemCommand(params));
    res.status(200).json({ message: 'Satus atualizado com sucesso!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteOne(req, res) {
  const { id } = req.params;

  const paramsFind = {
    TableName: USERS_TABLE,
    Key: {
      taskId: { S: id },
    },
  };

  try {
    await dynamoDBClient.send(new DeleteItemCommand(paramsFind));
    res.status(200).json({ message: 'Deletado com sucesso!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

async function deleteAll(req, res) {
  const params = {
    TableName: USERS_TABLE,
  };

  try {
    const { Items } = await dynamoDBClient.send(new ScanCommand(params)); // get na tabela passada por params
    Items.forEach(async (i) => {
      const paramsDelete = {
        TableName: USERS_TABLE,
        Key: { taskId: i.taskId },
      };

      await dynamoDBClient.send(new DeleteItemCommand(paramsDelete));
    });

    res.status(200).json({ message: 'Foi de base!' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
}

module.exports = { getAll, create, getOne, update, updateStatus, deleteOne, deleteAll };