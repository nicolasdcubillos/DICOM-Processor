import json
import requests
import boto3

def lambda_handler(event, context):
    try:
        ssm = boto3.client('ssm')
        response = ssm.get_parameter(Name='/params-dicom-processor/ms-gateway', WithDecryption=False)
        gateway_url = response['Parameter']['Value']
        resultClassification = event[1]["body"]
        resultDicomRegistry = event[0]["body"]
        uuid = resultDicomRegistry.split("\n")[0].split(":")[1].strip()
        url = f"{gateway_url}/api-ms-admon/registros/updateStatus/{uuid}/{resultClassification}"
        headers = {"Content-Type": "application/json"}
        response = requests.put(url, headers=headers)
        
        return {
            'statusCode': 200,
            'body': json.dumps(str(response))
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }
