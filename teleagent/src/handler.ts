import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda'
import {
  getChatSession,
  saveChatSession,
  updateChatSession,
} from './chat-service'

/**
 * GET /chat 요청.
 */
const handleGetChat = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const sessionId = event.queryStringParameters?.sessionId
  if (!sessionId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ ok: false, message: 'sessionId is required' }),
    }
  }
  const session = await getChatSession(sessionId)
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, session }),
  }
}

/**
 * POST /chat 요청.
 */
const handlePostChat = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
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
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true }),
  }
}

/**
 * API 핸들러.
 */
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (event.httpMethod === 'GET' && event.path === '/chat') {
    return handleGetChat(event)
  } else if (event.httpMethod === 'POST' && event.path === '/chat') {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Request body is missing or empty' }),
      }
    }
    return handlePostChat(event)
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  }
  // return {
  //   statusCode: 200,
  //   body: JSON.stringify('Hello from Lambda!'), // ChatGPT 최종 응답.
  // }
}
