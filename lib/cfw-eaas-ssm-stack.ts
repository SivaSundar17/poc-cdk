import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ssm from 'aws-cdk-lib/aws-ssm';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CfwEaasPocSSMStack extends cdk.Stack {

    cfnProps: cdk.CfnOutput;

    valueLookup: string;
    stringValueSSM: string;

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Retrieve the latest value of the non-secret parameter
        // with name "/My/String/Parameter".
        this.stringValueSSM = ssm.StringParameter.fromStringParameterAttributes(this, 'MyValue', {
            parameterName: '/cfwParameterStore/cfw-instances/small-windows',
        }).stringValue;

        // this.windowsAmiId = ssm.StringParameter.fromStringParameterAttributes(this, 'windowsAmiIdValue', {
        //     parameterName: '/cfwParameterStore/cfw-instances/small-windows/ami_id',
        // }).stringValue;



        new cdk.CfnOutput(this, 'stringValueSSM', {
            value: this.stringValueSSM,
            description: 'The value of the SSM parameter',
        }).toString;

    }
}
