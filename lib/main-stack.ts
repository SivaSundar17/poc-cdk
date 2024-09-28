import { InstanceConfig } from "./config/instance-config";
import * as cdk from 'aws-cdk-lib/core';
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as iam from "aws-cdk-lib/aws-iam";


export class MainStack extends cdk.Stack {

    constructor(app: cdk.App, id: string, stackProps: cdk.StackProps, buildConfig: InstanceConfig) {
        super(app, id, stackProps);

        const isProd: boolean = true;

        function name(name: string): string {
            return id + "-" + name;
        }

        // const exampleLambda = new lambda.Function(this, name("example"), {
        //     functionName: name("example"),
        //     runtime: lambda.Runtime.NODEJS_12_X,
        //     code: new lambda.AssetCode('../lib/lambda/app.js'),
        //     handler: "app.handler",
        //     // environment: {
        //     //     SOME_EXTERNAL_API_URL: buildConfig.Parameters.SomeExternalApiUrl,
        //     // },
        //     timeout: cdk.Duration.seconds(30),
        //     memorySize: isProd ? 1024 : 128,
        //     // layers: [lambda.LayerVersion.fromLayerVersionArn(this, name("insight-layer"), buildConfig.Parameters.LambdaInsightsLayer)],
        // });

        // exampleLambda.role?.addManagedPolicy(
        //     iam.ManagedPolicy.fromAwsManagedPolicyName('CloudWatchLambdaInsightsExecutionRolePolicy')
        // );
    }
}

export default MainStack;