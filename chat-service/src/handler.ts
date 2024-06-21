import { APIGatewayProxyHandler } from 'aws-lambda'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
} from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient({ region: process.env.AWS_REGION })
const docClient = DynamoDBDocumentClient.from(client)

const saveChatSession = async (
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

const updateChatSession = async (
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

const getChatSession = async (sessionId: string) => {
  const params = {
    TableName: 'ChatSessions',
    Key: { SessionId: sessionId },
  }
  const data = await docClient.send(new GetCommand(params))
  return data.Item || null
}

export const getChatHandler: APIGatewayProxyHandler = async (event) => {
  const sessionId = event.queryStringParameters?.sessionId
  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'sessionId is required' }),
    }
  }
  const session = await getChatSession(sessionId)
  return { statusCode: 200, body: JSON.stringify({ ok: true, session }) }
}

export const postChatHandler: APIGatewayProxyHandler = async (event) => {
  const {
    sessionId,
    userPhoneNumber,
    messages,
    startTime,
    endTime,
    sessionStatus,
  } = JSON.parse(event.body!)
  const existingSession = await getChatSession(sessionId)

  if (existingSession) {
    await updateChatSession(
      sessionId,
      userPhoneNumber,
      messages,
      startTime,
      endTime,
      sessionStatus,
    )
  } else {
    await saveChatSession(
      sessionId,
      userPhoneNumber,
      messages,
      startTime,
      endTime,
      sessionStatus,
    )
  }

  return { statusCode: 200, body: JSON.stringify({ ok: true }) }
}
