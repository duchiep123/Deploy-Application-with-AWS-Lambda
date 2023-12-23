import * as AWS from 'aws-sdk'
//import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'


var AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)

// Create a logger
const logger = createLogger('TodosAccess')

export class TodosAccess {
    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly todosIndex = process.env.INDEX_NAME,
      private readonly todosTable = process.env.TODOS_TABLE
    ) {}
  
    async getAllTodos(userId: string): Promise<TodoItem[]> {
      logger.info('Get all todos')
  
      const result = await this.docClient
        .query({
          TableName: this.todosTable,
          IndexName: this.todosIndex,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          }
        })
        .promise()
  
      return result.Items as TodoItem[]
    }
  
    async createTodoItem(todoItem: TodoItem): Promise<TodoItem> {
      logger.info('Create a todo item')
      try {
        await this.docClient
        .put({
          TableName: this.todosTable,
          Item: todoItem
        })
        .promise()
  
        return todoItem as TodoItem
      } catch (e) {
         logger.error("Error creating todo", { error: e.message });
         throw e
      }
    }
  
    async updateTodoItem(todoId: string,
      userId: string,
      todoUpdate: TodoUpdate
    ): Promise<void> {
      logger.info(`Updating todo with id: ${todoId}`)
      try {
        await this.docClient
        .update({
          TableName: this.todosTable,
          Key: { userId, todoId },
          ConditionExpression: 'attribute_exists(todoId)',
          UpdateExpression: 'set #n = :n, dueDate = :due, done = :dn',
          ExpressionAttributeNames: { '#n': 'name' },
          ExpressionAttributeValues: {
            ':n': todoUpdate.name,
            ':due': todoUpdate.dueDate,
            ':dn': todoUpdate.done
          }
        })
        .promise()
      } catch (e) {
        logger.error("Error updating todo", { error: e.message });
        throw e
      }
    }
  
    async deleteTodoItem(todoId: string, userId: string): Promise<void> {
      logger.info('Delete todo item func')
      try {
        await this.docClient
        .delete({
          TableName: this.todosTable,
          Key: {
            todoId,
            userId
          }
        })
        .promise()
      } catch (e) {
        logger.error("Error deleting todo", { error: e.message });
        throw e
      }
    }
  }