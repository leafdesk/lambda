import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({
  region: process.env.TELEAGENT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.TELEAGENT_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.TELEAGENT_AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(client)

/**
 * 대화 세션 신규 삽입.
 */
export const saveChatSession = async (
  sessionId: string,
  userPhoneNumber: string,
  messages: string,
  startTime: string,
  endTime: string,
  sessionStatus: string,
) => {
  const params = {
    TableName: 'ChatSessions',
    Item: {
      SessionId: sessionId,
      UserPhoneNumber: userPhoneNumber,
      Messages: messages,
      StartTime: startTime,
      EndTime: endTime,
      SessionStatus: sessionStatus,
    },
  }
  await docClient.send(new PutCommand(params))
}

/**
 * 대화 세션 업데이트.
 */
export const updateChatSession = async (
  sessionId: string,
  userPhoneNumber: string,
  messages: string,
  startTime: string,
  endTime: string,
  sessionStatus: string,
) => {
  const params = {
    TableName: 'ChatSessions',
    Key: { SessionId: sessionId },
    UpdateExpression: 'set Messages = :m, EndTime = :e, SessionStatus = :s',
    ExpressionAttributeValues: {
      ':m': messages,
      ':e': endTime,
      ':s': sessionStatus,
    },
  }
  await docClient.send(new UpdateCommand(params))
}

/**
 * 대화 세션 조회.
 */
export const getChatSession = async (sessionId: string) => {
  const params = {
    TableName: 'ChatSessions',
    Key: { SessionId: sessionId },
  }
  const data = await docClient.send(new GetCommand(params))
  return data.Item || null
}
