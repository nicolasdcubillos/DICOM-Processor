import json
import boto3
import requests
import os

def lambda_handler(event, context):
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(Name='/params-dicom-processor/ms-gateway', WithDecryption=False)
    gateway_url = response['Parameter']['Value']
    key = event['detail']['object']['key']

    try:
        s3 = boto3.client('s3')
        s3.download_file('s3-dicom-processor', key, '/tmp/temp_file.tar.gz')

        url = f"{gateway_url}/api-ms-nodule-classifier/nodule-classification"
        headers = {"Content-Type": "application/json"}

        files = {'file': open('/tmp/temp_file.tar.gz', 'rb')}
        response = requests.post(url, files=files, headers=headers)

        if response.status_code == 201:
            response_data = response.json()
            print('Respuesta del servidor:')
            print(response_data)
            return {
                'statusCode': 200,
                'body': response_data
            }
        else:
            print(f'Error en la solicitud. Código de estado: {response.status_code}')
            print('Texto de respuesta del servidor:')
            print(response.text)
            return {
                'statusCode': response.status_code,
                'body': response.text
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
