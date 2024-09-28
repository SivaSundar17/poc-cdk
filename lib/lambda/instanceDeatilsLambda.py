import json
import boto3 
import cryptoLayer
# from Crypto.PublicKey import RSA
# from Crypto.Cipher import PKCS1_OAEP

ec2=boto3.client('ec2')
ssm_client=boto3.client('ssm')


def lambda_handler(event, context):
    # TODO implement
    
    encryptedPasswordData=ec2.get_password_data(InstanceId='i-04057439112f3361c');
    encryptedPassword=encryptedPasswordData['PasswordData'];
    print("***********encryptedPss "+encryptedPassword);
    pemvalue = ssm_client.get_parameter(
        Name='/ec2/keypair/key-0e797cd9345cf8941',
        # WithDecryption=with_decryption  # Set to True if the parameter is encrypted
        )
    print("********** pemvalue", pemvalue['Parameter']['Value'])
    
    
    print("********decrpted password ", decryptedPassword)
    
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
