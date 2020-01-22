import os
import uuid
import time
import json
import boto3
import base64
from boto3.dynamodb.conditions import Key

bucket_name = os.environ['BucketName']
table_name = os.environ['TableName']

headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Credentials': 'true'
}


def handler(event, context):
    print(event, context.identity.cognito_identity_id)

    path = event['path'].split('/')
    if path[-1] == '':
        path = path[:-1]
    if path[1] == 'files':
        dynamodb = boto3.resource('dynamodb').Table(table_name)
        s3 = boto3.client('s3')

        http_method = event.get('httpMethod')
        user_id = event['requestContext']['authorizer']['claims']['sub']

        if len(path) > 2:
            file_id = path[2]

            if http_method == 'GET':
                print('get file', file_id)

                item = dynamodb.get_item(
                    Key={
                        'userId': user_id,
                        'fileId': file_id,
                    }
                ).get('Item')
                if item is not None:
                    obj = s3.get_object(Bucket=bucket_name, Key=file_id)['Body'].read()

                    res = {
                        'file': str(base64.b64encode(obj), "utf-8"),
                        'fileName': item.get('fileName'),
                        'createdAt': item.get('createdAt')
                    }
                    return {'body': json.dumps(res), 'headers': headers, 'statusCode': 200}
                else:
                    return {'body': json.dumps({'error': 'File not found'}), 'headers': headers, 'statusCode': 404}
            if http_method == 'DELETE':
                print('delete file', path[2])

                item = dynamodb.get_item(
                    Key={
                        'userId': user_id,
                        'fileId': file_id,
                    }
                ).get('Item')
                if item is not None:
                    dynamodb.delete_item(
                        Key={
                            'userId': user_id,
                            'fileId': file_id,
                        }
                    )
                    s3.delete_object(Bucket=bucket_name, Key=file_id)
                    return {'body': json.dumps({'message': 'File was successfully removed'}), 'headers': headers,
                            'statusCode': 200}
                else:
                    return {'body': json.dumps({'error': 'File not found'}), 'headers': headers, 'statusCode': 404}

        elif http_method == 'POST':
            print('post file')

            body = json.loads(event['body'])
            file_content = base64.b64decode(body.get('file'))
            file_name = body.get('name')
            file_id = str(uuid.uuid4())
            s3.put_object(Bucket=bucket_name, Key=file_id, Body=file_content)
            item = {
                'userId': user_id,
                'fileId': file_id,
                'fileName': file_name,
                'createdAt': str(int(time.time()))
            }
            dynamodb.put_item(Item=item)
            return {'body': json.dumps(item), 'headers': headers, 'statusCode': 200}
        elif http_method == 'GET':
            print('get files')
            items = dynamodb.query(
                KeyConditionExpression=Key('userId').eq(user_id)
            ).get('Items')
            return {'body': json.dumps(items), 'headers': headers, 'statusCode': 200}

    return {
        'body': 'Resource not found',
        'headers': headers,
        'statusCode': 404
    }
