// import { InstanceConfig } from './config/instance-config';
// import * as cdk from 'aws-cdk-lib';
// import { Construct } from 'constructs';
// import * as ec2 from 'aws-cdk-lib/aws-ec2';
// import * as fs from 'fs';
// import path = require('path');
// import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
// import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
// import * as lambda from 'aws-cdk-lib/aws-lambda';
// import * as iam from 'aws-cdk-lib/aws-iam';
// import * as ssm from 'aws-cdk-lib/aws-ssm';
// import * as cr from 'aws-cdk-lib/custom-resources';
// const AWS = require('aws-sdk');
// import * as events from 'aws-cdk-lib/aws-events';
// import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
// import * as targets from 'aws-cdk-lib/aws-events-targets';
// import { CommonConfig } from './config/common-config';

// export interface EC2StackProps extends cdk.StackProps {
//     vpc: ec2.Vpc;
//     commonConfig: CommonConfig;
//     instanceConfig: InstanceConfig;
//     // ami_id: string;
//     // region: string;
// }

// export class CfwEaasPocLambdaStack extends cdk.Stack {



//     constructor(scope: Construct, id: string, props: EC2StackProps) {
//         super(scope, id, props);

//         const lambdaFunction = new lambda.Function(this, 'DescribeInstanceLambda', {
//             runtime: lambda.Runtime.NODEJS_20_X,
//             handler: 'describeInstance.handler',
//             code: lambda.Code.fromAsset(path.join(__dirname, './lambda')), // Assumes you put the Lambda code in the 'lambda' directory
//             environment: {
//                 // You can pass environment variables here if needed
//             },
//         });

//         // Grant EC2 permissions to the Lambda function
//         lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
//             actions: [
//                 'ec2:DescribeInstances',
//                 'ec2:GetPasswordData'
//             ],
//             resources: ['*'], // Optionally, restrict to specific instance ARNs
//         }));

//         // Grant SSM permissions to the Lambda function
//         lambdaFunction.addToRolePolicy(new iam.PolicyStatement({
//             actions: [
//                 'ssm:PutParameter'
//             ],
//             resources: ['arn:aws:ssm:*:*:parameter/windows-instance/*'],
//         }));
//     }
// }