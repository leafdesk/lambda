import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

/**
 * DynamoDB Client.
 * TODO: (환경 변수 이름 변경)액세스 키는 TeleAgent 한정이 아니고, 전체 테이블이다.
 */
const client = new DynamoDBClient({
  region: process.env.TELEAGENT_AWS_REGION,
  credentials: {
    accessKeyId: process.env.TELEAGENT_AWS_ACCESS_KEY!,
    secretAccessKey: process.env.TELEAGENT_AWS_SECRET_ACCESS_KEY!,
  },
})

const docClient = DynamoDBDocumentClient.from(client)

export default docClient
