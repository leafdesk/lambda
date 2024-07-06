import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import {
  getChatSession,
  saveChatSession,
  updateChatSession,
} from '../services/chat-service'

/**
 * GET /chat 요청.
 */
export const handleGetChat = async (
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
export const handlePostChat = async (
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
