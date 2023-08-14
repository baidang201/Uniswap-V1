# Uniswap V1 Exchange Contract

This repository contains a Solidity smart contract implementing a basic version of the Uniswap V1 Exchange. Uniswap V1 was one of the early decentralized exchange protocols on Ethereum, allowing users to swap tokens and provide liquidity to token pairs. This contract includes functionalities for adding and removing liquidity, as well as swapping tokens with ETH.

## Contract Overview

The Exchange contract inherits from the ERC20 standard and implements basic Uniswap V1 functionalities. It includes the following features:

- Adding liquidity to the exchange by providing tokens and ETH.
- Removing liquidity and receiving tokens and ETH in return.
- Swapping ETH for tokens and tokens for ETH.

## Getting Started

1. Install dependencies:
   This contract uses the OpenZeppelin library, specifically the ERC20 implementation. Ensure you have OpenZeppelin installed.

2. Deploy the Contract:
   Deploy the Exchange contract by passing the address of the token you want to use in the exchange to the constructor.

3. Interact with the Contract:
   Use the provided functions to add liquidity, remove liquidity, and perform token swaps. Check the contract documentation for each function's purpose and usage.

## Contract Deployment and Testing

This repository primarily focuses on providing the Exchange contract's source code and basic documentation. To deploy and test the contract, follow these steps:

1. Set up a development environment with Solidity compiler and Ethereum node.

2. Deploy the contract to a local or testnet Ethereum network using a development tool like Remix or Truffle.

3. Write and execute tests to ensure the contract behaves as expected. The test cases should cover different scenarios, including adding/removing liquidity and performing swaps.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This is a simplified version of the Uniswap V1 Exchange contract and should not be used in production environments without proper security audits. Always exercise caution when dealing with smart contracts and blockchain-related projects.
