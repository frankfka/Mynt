# Mynt - Tokenization-as-a-Service

[Devpost Page](https://devpost.com/software/mynt)

[Demo Video](https://www.youtube.com/watch?v=KMUEnmN5YEc)

Mynt is a hackathon project that leverages the Lisk blockchain protocol and the Rapyd API to create
a tokenization-as-a-service platform that interoperates seamlessly with fiat economies.

#### Running this Project

The respective directories contain `README` files that explain how to run the Next.js app and the Lisk
blockchain. The only required file is an environment file, `.env.local`, which must be placed in `mynt-app/`. This is
used to store secret keys for authentication with Rapyd. The following keys are needed: 
`RAPYD_ACCESS_KEY`, `RAPYD_SECRET_KEY`.

For the Lisk blockchain, two helper scripts are specified:

`start-sidechain`: Starts the Lisk sidechain

`start-sidechain-clean`: Wipes the current blockchain data and starts a new sidechain

## Why?

Blockchain introduces the concept of scarcity into digital economies. In an ever connected world, tokenization of assets has the opportunity to drive the future of the global economy by transcending traditional geopolitical boundaries. This technology has applications beyond the public financial system - blockchain has the ability to create new private economies, such as setting a new standard for how content creators and artists are funded.

Despite the promise of tokenization, current applications of blockchain are far from ready to be embraced by the majority. The barrier to entry is extremely high on both the supply side (creating unique tokens) and the demand side (purchasing these tokens). As a result, the transacting of digital assets has been limited to a small cohort of technologically-proficient early adopters.

This divide creates a large opportunity space - how can we help build the future of commerce by enabling **easy & seamless tokenization and transaction of digital assets**?

## How?

Mynt is a tokenization-as-a-service platform built upon [Rapyd](https://www.rapyd.net/) and [Lisk](https://lisk.com/). It enables entities (whether it be a company or an individual content creator) to create a distribute custom assets in the form of fungible _and_ non-fungible tokens. Additionally, Mynt offers a _seamless global_ gateway between tokenized and fiat economies by enabling global payment & disbursement methods.

The Mynt service has the opportunity to help form the backbone of the future economy. Some applications include:

- Creation of token marketplaces built on top of the Mynt service (ex. a creator marketplace)
- Allowing corporations to access a privately hosted Mynt service to create internal economies (ex. an employee rewards system, or a customer loyalty program)
- Forming the foundation of a decentralized token economy by introducing a native "Mynt" token to encourage the hosting of delegate nodes

**Why Rapyd?**

Rapyd is a global digital payments company and accepts payment methods from over a hundred companies. Its fintech APIs enable a truly global solution that supports both accepting payments and disbursing to regional accounts.

**Why Lisk?**

Lisk enables developers to build custom blockchains based on the Lisk protocol. This enables a high level of customization over what and how transactions can be executed. Lisk's future roadmap includes inherent support for NFTs and cross-blockchain interoperability.

## A Case Study - The Creator Economy

Mynt is designed to form the backbone of a digital token-fiat economy. To demonstrate its usage, I created a demo application that shows one use case in the form of a creator token marketplace.

Within this marketplace, content creators can create and offer their own token with a specified name and price. Fans can then purchase tokens from the content creator and redeem these tokens in the future.

For example, a Youtube creator could sell tokens to fund the production of videos, then offer a redemption of these tokens for a physical meet & greet.

## What's Next?

With the help of Lisk and Rapyd, we can create one of the world's first tokenization-as-a-service platforms that puts the consumer **first**. We can leverage Rapyd's global payment integrations as well as the flexibility of the Lisk protocol to build a solution that enables _everyone_ to benefit from a digital economy.
