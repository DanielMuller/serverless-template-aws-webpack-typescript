import type { APIGatewayProxyResult, APIGatewayProxyHandlerV2 } from 'aws-lambda'

const main = async (event: APIGatewayProxyHandlerV2): Promise<APIGatewayProxyResult> => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless! Your Hello function executed successfully!',
      input: event,
    }),
  }

  return response
}

export const handler = main
