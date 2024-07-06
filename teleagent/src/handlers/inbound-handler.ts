import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getFlag } from '../services/flag-service'

export const handlePostInbound = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const flag = await getFlag('Test')

  if (!flag) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        ok: false,
        message: 'No flag found',
      }),
    }
  }
  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      message: 'handlePostInbound.',
      NextAction: flag.Payload,
    }),
  }
}
