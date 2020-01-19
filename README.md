## AWS CLI

Get created stacks names
```
$ aws cloudformation list-stacks --stack-status-filter UPDATE_COMPLETE --query "StackSummaries[*].StackName" --profile personal
```

Update stack
```
$ aws cloudformation update-stack --template-body file://cloudformation.yaml  --stack-name ucu-aws-project --capabilities CAPABILITY_NAMED_IAM --profile personal
```

Get 5 last stack events
```
$ aws cloudformation describe-stack-events --stack-name ucu-aws-project --query "StackEvents[0:5].[ResourceStatus,LogicalResourceId]" --profile personal
```
