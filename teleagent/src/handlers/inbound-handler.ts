import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

export const handleInboundCall = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  // const { callerNumber, calledNumber, callStartTime, callStatus } = JSON.parse(
  //   event.body!,
  // )

  return {
    statusCode: 200,
    body: JSON.stringify({ ok: true, message: 'handleInboundCall.' }),
  }
}
