import { InstanceConfig } from './../lib/config/instance-config';
import { CommonConfig } from './../lib/config/common-config';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';

import { CfwEaasPocVPCStack } from '../lib/cfw-eaas-poc-vpc-stack';
import { CfwEaasPocEC2Stack } from '../lib/cfw-eaas-poc-ec2-stack';
import { MainStack } from '../lib/main-stack'
import * as dotenv from 'dotenv';
import { CFWEaasPocDynamoDBStack } from '../lib/cfw-eaas-poc-dynamodb-stack'
const yaml = require('js-yaml');
// import { Tags } from 'aws-cdk-lib/core';

const aws = require('aws-sdk');
let ssm = new aws.SSM();

dotenv.config();


const app = new cdk.App();


async function getInstanceConfig(instanceType: any) {
  // const instanceType = app.node.tryGetContext('instanceType');
  console.log('*********instanceType' + instanceType);
  let instanceConfig: InstanceConfig;

  // if (instanceType != undefined) {
  let instanceSetupConfig = await ssm.getParameter({ Name: '/cfw-app-config-params/cfw-instances/' + instanceType }).promise();
  console.log("### Got config!!");
  let unparsedEnv = yaml.load(instanceSetupConfig.Parameter.Value, "utf8");
  console.log("*****instance type" + unparsedEnv['instance_type']);
  console.log("*****ami_id " + unparsedEnv['ami_id'])


  instanceConfig = {
    // ami_id: ensureString(unparsedEnv, 'ami_id'),
    ami_id: unparsedEnv['ami_id'],
    // region: ensureString(unparsedCommonSetupEnv, 'region'),
    instance_type: unparsedEnv['instance_type']
  };
  // }
  // else {
  //   console.log("No instanceType provided, returning default config");
  //   instanceConfig = {
  //     ami_id: '',   // Default value for ami_id
  //     instance_type: ''   // Default instance type
  //   };
  // }

  return instanceConfig;
}

async function getCommonConfig(env: any) {
  // const env = app.node.tryGetContext('env');
  console.log('*********env' + env);

  let commonConfig: CommonConfig;
  // if (env != undefined) {
  let conmonSetupConfig = await ssm.getParameter({ Name: '/cfw-app-config-params/common-setup/' + env }).promise();
  console.log("### Got config!!");
  let unparsedCommonSetupEnv = yaml.load(conmonSetupConfig.Parameter.Value, "utf8");
  console.log("******* common setup " + unparsedCommonSetupEnv);

  commonConfig = {
    region: unparsedCommonSetupEnv['region']
  }
  // }
  // else {
  //   commonConfig = {
  //     region: ''
  //   }
  // }

  console.log("****check")

  return commonConfig;
}

const vpcStack = new CfwEaasPocVPCStack(app, 'CfwEaasPocVPCStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,  // Your AWS Account ID or use CDK_DEFAULT_ACCOUNT for default
    region: process.env.CDK_DEFAULT_REGION     // Your AWS Region or use CDK_DEFAULT_REGION for default
  },
})


// new CfwEaasPocEC2Stack(app, 'CfwEaasPocEC2Stack', {
//   env: {
//     account: process.env.CDK_DEFAULT_ACCOUNT,  // Your AWS Account ID or use CDK_DEFAULT_ACCOUNT for default
//     region: process.env.CDK_DEFAULT_REGION     // Your AWS Region or use CDK_DEFAULT_REGION for default
//   },
//   vpc: vpcStack.vpc,
//   commonConfig: await getCommonConfig(),
//   instanceConfig: await getInstanceConfig(),
//   // ami_id: instanceConfig.ami_id,
//   // region: commonConfig.region
// });


async function Main() {
  const env = app.node.tryGetContext('env');
  const instanceType = app.node.tryGetContext('instanceType');

  // const isDestroy = process.argv.includes('destroy');

  console.log("********", +env + "********" + instanceType)
  const instanceConfig = await getInstanceConfig(instanceType);
  const commonConfig = await getCommonConfig(env);
  // instanceConfig = await getInstanceConfig(env);
  // commonConfig= await getCommonConfig(instanceType);

  new CfwEaasPocEC2Stack(app, 'CfwEaasPocEC2Stack', {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,  // Your AWS Account ID or use CDK_DEFAULT_ACCOUNT for default
      region: process.env.CDK_DEFAULT_REGION     // Your AWS Region or use CDK_DEFAULT_REGION for default
    },
    vpc: vpcStack.vpc,
    commonConfig: commonConfig,
    instanceConfig: instanceConfig,
    // ami_id: instanceConfig.ami_id,
    // region: commonConfig.region
  });

}
Main();



// function ensureString(object: { [name: string]: any }, propName: string): string {
//   console.log("******prop" + propName);
//   console.log("********obj" + object[propName]);
//   // if (!object[propName] || object[propName].trim().length === 0)
//   //   throw new Error(propName + " does not exist or is empty");

//   return object[propName];
// }



// Tags.of(app).add('App', buildConfig.);
// Tags.of(app).add('Environment', buildConfig.Environment);

// let mainStackName = "main";

// import { CfwEaasPocSSMStack } from './../lib/cfw-eaas-ssm-stack';
// import { InstanceType, Vpc } from 'aws-cdk-lib/aws-ec2';
// const mainStack = new MainStack(app, mainStackName,
//   {
//     // env:
//     // {
//     //   region: buildConfig.AWSProfileRegion,
//     //   account: buildConfig.AWSAccountID
//     // }
//   }, buildConfig);