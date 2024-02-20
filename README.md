# asset-swap-server

A Backend App for asset-swap-vue app

# Tech Stack used

## Architecture
- Microservices ; Event Based; shared DB architecture
- RabbitMQ for microservices comms

## Tools
- NestJS as Backend Framework
- HTTP REST Apis
- DB:
    - Postgres
    - ORMS:
        - TypeORM
- Jest for unit testing

## Blockchain 
- Foundry for smart contract dev and testing 
- anvil as local blockchain node
- MetaMask as web3 wallet 
- Storing NFT tokens of assets on IPFS nodes
    - nft.storage service used

## Cloud and DevOPS
- AWS S3 bucket for storing static data
- Docker for containerizing each microservice
- Deploying these images to AWS ECR private container registry 
- AWS ECS to orchestrate a cluster of these docker images
- CI / CD:
    - AWS Codepipline to create ci / cd

## Front End
- VueJS
- Vuetify as design framework
- Figma for creating ui ux designs

