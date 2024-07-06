import { GetCommand, PutCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb'
import docClient from '../utils/dynamodb-util'

/**
 * 플래그 신규 삽입.
 */
export const insertFlag = async (partitionKey: string, payload: string) => {
  const params = {
    TableName: 'Flags',
    Item: {
      PartitionKey: partitionKey,
      Payload: payload,
    },
  }
  await docClient.send(new PutCommand(params))
}

/**
 * 플래그 변경.
 */
export const updateFlag = async (partitionKey: string, payload: string) => {
  const params = {
    TableName: 'Flags',
    Key: { PartitionKey: partitionKey },
    UpdateExpression: 'set Payload = :p',
    ExpressionAttributeValues: {
      ':p': payload,
    },
  }
  await docClient.send(new UpdateCommand(params))
}

/**
 * 플래그 조회.
 */
export const getFlag = async (partitionKey: string) => {
  const params = {
    TableName: 'Flags',
    Key: { PartitionKey: partitionKey },
  }
  const data = await docClient.send(new GetCommand(params))
  return data.Item || null
}
