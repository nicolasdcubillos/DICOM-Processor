import json
import tarfile
import boto3
import requests

def lambda_handler(event, context):
    ssm = boto3.client('ssm')
    response = ssm.get_parameter(Name='/params-dicom-processor/ms-gateway', WithDecryption=False)
    gateway_url = response['Parameter']['Value']
    key = event['detail']['object']['key']
    archivo_metadata = "metadata"
    try:
        s3 = boto3.client('s3')
        s3.download_file('s3-dicom-processor', key, '/tmp/temp_file.tar.gz')
        with tarfile.open('/tmp/temp_file.tar.gz', 'r:gz') as tar:
            if archivo_metadata in tar.getnames():
                metadata_file = tar.extractfile(archivo_metadata)
                metadata_content = metadata_file.read()
                
                lineas = metadata_content.decode('utf-8').split('\n')
                
                payload = {
                    "tipoRegistro": 0,
                    "usuario": 1
                }
                
                for linea in lineas:
                    if linea.startswith("UUID: "):
                        payload["uuid"] = linea.replace("UUID: ", "")
                    elif linea.startswith("PatientName: "):
                        payload["nombrePaciente"] = linea.replace("PatientName: ", "")
                    elif linea.startswith("StudyDescription: "):
                        payload["nombreEstudio"] = linea.replace("StudyDescription: ", "")
                    elif linea.startswith("Preview: "):
                        payload["imagenPrevia"] = linea.replace("Preview: ", "")
                        
                url = f"{gateway_url}/api-ms-admon/registros"
                headers = {"Content-Type": "application/json"}
                response = requests.post(url, json=payload, headers=headers)
                if response.status_code == 201:
                    response_data = response.json()
                    print('Respuesta del servidor:')
                    print(response_data)
                    return {
                        'statusCode': 200,
                        'body': metadata_content
                    }
                else:
                    print(f'Error en la solicitud. Código de estado: {response.status_code}')
                    print('Texto de respuesta del servidor:')
                    print(response.text)
                    return {
                        'statusCode': response.status_code,
                        'body': response.text
                    }
            else:
                return {
                    'statusCode': 404,
                    'body': json.dumps('El archivo "metadata" no fue encontrado en el archivo .tar.gz')
                }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps(str(e))
        }