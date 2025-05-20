import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda'
import { handleGetChat, handlePostChat } from './handlers/chat-handler'

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
