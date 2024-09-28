import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as path from 'path';
import * as cr from 'aws-cdk-lib/custom-resources';
import * as cdk from 'aws-cdk-lib';


export class CFWEaasPocDynamoDBStack extends Stack {
    table: dynamodb.Table;
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        //create dynamo db
        this.table = new dynamodb.Table(this, 'MyDynamoDBTable', {
            partitionKey: { name: 'primary_key', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'secondary_key', type: dynamodb.AttributeType.STRING },

            tableName: 'cfw_app_config',
        });


        // Create a Custom Resource to trigger Lambda after DynamoDB table creation
        // const customResourceProvider = new cr.Provider(this, 'CustomResourceProvider', {
        //     onEventHandler: defaultDataLambda,
        // });

        // Trigger the Custom Resource which will invoke the Lambda function
        // new cdk.CustomResource(this, 'InsertDataCustomResource', {
        //     serviceToken: customResourceProvider.serviceToken,
        // });





    }
}