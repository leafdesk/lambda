import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handlePostInbound = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: 'handlePostInbound.' }),
  }
}
