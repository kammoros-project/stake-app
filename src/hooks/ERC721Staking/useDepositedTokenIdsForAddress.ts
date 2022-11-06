import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC721Staking from "../../abi/ERC721Staking.json"

export default function useDepositedTokenIdsForAddress(
    contractAddress: string | Falsy,
    address: string | Falsy
  ): BigNumber[] | undefined {
    const { value, error } =
      useCall(
        address &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC721Staking.abi), // instance of called contract
            method: "depositedTokenIdsForAddress", // Method to be called
            args: [address], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }