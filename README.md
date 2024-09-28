# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template


## Configure AWS CLI in the terminal and provide the following
 
access key ID
secret access key
region

## to deploy the stack using CDK use the below command
cdk deploy --context instanceType="t2micro-windows" --context env="dev" --all
cdk destroy --context instanceType="t2micro-windows" --context env="dev" --all

 aws ec2 terminate-instances --instance-ids i-0ac826208d97059b9

### git
git remote add origin ''
git branch -M main
git push -u origin main


### progress

Completed
------
-> dynamically getting params from ssm.
-> provisioned ec2 instance.
-> Winrm installed in the instance.
-> Ansible Playbook deployement.
-> Testing

In progress
----------
-> few Winrm configurations
-> with manual configurations tested.



