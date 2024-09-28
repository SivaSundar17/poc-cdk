import { InstanceConfig } from './config/instance-config';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as fs from 'fs';
import path = require('path');
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as cr from 'aws-cdk-lib/custom-resources';
const AWS = require('aws-sdk');
import * as events from 'aws-cdk-lib/aws-events';
import * as eventsTargets from "aws-cdk-lib/aws-events-targets";
import * as targets from 'aws-cdk-lib/aws-events-targets';
import { CommonConfig } from './config/common-config';


export interface EC2StackProps extends cdk.StackProps {
    vpc: ec2.Vpc;
    commonConfig: CommonConfig;
    instanceConfig: InstanceConfig;
    // ami_id: string;
    // region: string;
}

export class CfwEaasPocEC2Stack extends cdk.Stack {
    parameters: [];


    constructor(scope: Construct, id: string, props: EC2StackProps) {
        super(scope, id, props);

        // const ssmClient = new AWS.SSM();
        // const instancyType=props.instanceConfig.instance_type || 't2.micro';



        //Security Group
        const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
            vpc: props.vpc,
            allowAllOutbound: true,
            securityGroupName: 'MySecurityGroup'
        });

        // Allow inbound traffic on port 
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(3389));
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5985), 'Allow WinRM HTTP');
        securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5986), 'Allow WinRM HTTPS');
        // securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic());


        const keyPair = new ec2.KeyPair(this, 'Poc-KeyPair', {
            keyPairName: 'cfw-eaas-poc-instance-key',
            type: ec2.KeyPairType.RSA,
            format: ec2.KeyPairFormat.PEM,
        });

        const userData = ec2.UserData.forWindows();
        const psScriptPath = path.join(__dirname, 'winrm-userdata.ps1');
        const psScriptContent = fs.readFileSync(psScriptPath, 'utf8');

        // userData.addCommands(

        //     //Set WinRM service startup type to automatic
        //     "Set-Service WinRM -StartupType 'Automatic'",

        //     //Configure WinRM Service
        //     "Set-Item -Path WSMan:\\localhost\\Service\\Auth\\Certificate -Value $true",
        //     "Set-Item -Path WSMan:\\localhost\\Service\\AllowUnencrypted -Value $true",
        //     "Set-Item -Path WSMan:\\localhost\\Service\\Auth\\Basic -Value $true",
        //     "Set-Item -Path WSMan:\\localhost\\Service\\Auth\\CredSSP -Value $true",

        //     //Create a self-signed certificate and set up an HTTPS listener#Enable PowerShell remoting
        //     "Enable-PSRemoting -Force",

        //     // Modify EC2Launch config to enable running UserData on every boot
        //     // "Set-Content -Path C:\\ProgramData\\Amazon\\EC2-Windows\\Launch\\Config\\launchconfig.json -Value '{\"userdata\":{\"executeOnBoot\":\"true\"}}'",

        //     "New-SelfSignedCertificate -DnsName 'localhost' -CertStoreLocation Cert:\\LocalMachine\\My",
        //     "$thumbprint = (Get-ChildItem -Path Cert:\\LocalMachine\\My | Where-Object { $_.Subject -eq 'CN=localhost' }).Thumbprint",

        //     "New-Item WSMan:\\localhost\\Listener -Address * -Transport HTTPS -HostName 'localhost' -CertificateThumbPrint $thumbprint -force",

        //     //Create a firewall rule to allow WinRM HTTPS inbound
        //     "New-NetFirewallRule -DisplayName 'Allow WinRM HTTPS' -Direction Inbound -LocalPort 5986 -Protocol TCP -Action Allow",

        //     //Configure TrustedHosts
        //     "Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value '*' -Force",

        //     //#Set Execution Policy to Unrestricted
        //     "Set-ExecutionPolicy Unrestricted -Force",

        //     //Restart the WinRM service
        //     "Restart-Service WinRM"


        // );

        // CFW-Eaas-poc-instance
        userData.addCommands(
            'Write-Host "Running PowerShell script..."',
            `echo " ${psScriptContent.replace(/"/g, '""').replace(/\$/g, "`$")}" > C:\\winrm-userdata.ps1`,
            'PowerShell.exe -ExecutionPolicy Bypass -File "C:\\winrm-userdata.ps1"',
        );


        const instance = new ec2.Instance(this, `CFW-Eaas-poc-Instance`, {
            instanceName: `CFW-Eaas-poc-instance`,
            vpc: props.vpc,
            instanceType: new ec2.InstanceType(props.instanceConfig.instance_type),
            machineImage: ec2.MachineImage.genericWindows({ [props.commonConfig.region]: props.instanceConfig.ami_id }),

            securityGroup,
            vpcSubnets: {
                subnetType: ec2.SubnetType.PUBLIC
            },
            keyPair,
            userData: userData
        });

        new ssm.StringParameter(this, 'cfwInstanceIdSSM', {
            parameterName: '/cfw-eaas-poc/instanceId', // Replace with your desired name
            stringValue: instance.instanceId, // Replace with the value you want to store
            description: 'This parameter stores my EC2 instanceId', // Optional
            tier: ssm.ParameterTier.STANDARD, // You can choose between STANDARD or ADVANCED
            type: ssm.ParameterType.STRING, // You can also use STRING_LIST if needed
        });


        cdk.Tags.of(instance).add('Name', `CFW-Eaas-poc-instance`);

    }
}
