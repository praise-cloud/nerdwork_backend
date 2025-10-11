#!/bin/bash

# List of all services
services=("auth" "comic" "chapter" "file" "library" "nft" "payment" "profile" "transaction" "wallet" "helio-webhooks")

# Loop through each service and create serverless.yml
for service in "${services[@]}"; do
  echo "Creating serverless.yml for $service..."

  cat > "./lambda/$service/serverless.yml" << EOF
service: nerdwork-$service

provider:
  name: aws
  runtime: nodejs20.x
  stage: \${opt:stage, 'dev'}
  region: \${opt:region, 'us-east-1'}
  deploymentBucket:
    name: nerdwork-serverless-artifacts-\${self:provider.region}
    serverSideEncryption: AES256
  environment:
    NODE_ENV: \${self:provider.stage}
    DATABASE_URL: \${env:DATABASE_URL}
    JWT_SECRET: \${env:JWT_SECRET}
    AWS_REGION: \${self:provider.region}
  iam:
    role:
      statements:
        - Effect: Allow
          Action:
            - logs:CreateLogGroup
            - logs:CreateLogStream
            - logs:PutLogEvents
          Resource: "*"

functions:
  api:
    handler: dist/handler.handler
    timeout: 30
    memorySize: 512
    events:
      - httpApi:
          path: /$service
          method: any
      - httpApi:
          path: /$service/{proxy+}
          method: any

plugins:
  - serverless-offline
  - serverless-plugin-typescript
  - serverless-dotenv-plugin

custom:
  serverless-offline:
    httpPort: 3000
EOF

  echo "✅ Created serverless.yml for $service"
done

echo ""
echo "✅ All serverless.yml files created successfully!"