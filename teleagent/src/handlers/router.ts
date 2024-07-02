import { APIGatewayProxyHandler } from 'aws-lambda'
import { handleGetChat, handlePostChat } from './chat-handler'
import { handlePostInbound } from './inbound-handler'

export const route: APIGatewayProxyHandler = async (event, context) => {
  if (event.path === '/chat' && event.httpMethod === 'GET') {
    return handleGetChat(event)
  } else if (event.path === '/chat' && event.httpMethod === 'POST') {
    return handlePostChat(event)
  } else if (event.path === '/inbound' && event.httpMethod === 'POST') {
    return handlePostInbound(event)
  }
  return {
    statusCode: 404,
    body: JSON.stringify({ message: 'Not Found' }),
  }
}
