import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    throw new Error('Request body is missing or empty')
  }
  const { sessionId } = JSON.parse(event.body)
  console.log('sessionId:', sessionId)

  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'), // ChatGPT 최종 응답.
  }
  return response
}
