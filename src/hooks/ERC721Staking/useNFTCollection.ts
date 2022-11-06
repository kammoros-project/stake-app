import { Falsy, useCall } from "@usedapp/core";
import { Contract } from "ethers";
import ERC721Staking from "../../abi/ERC721Staking.json"

export default function useNFTCollection(
    contractAddress: string | Falsy
  ) {
    const { value, error } =
      useCall(
        contractAddress && {
            contract: new Contract(contractAddress, ERC721Staking.abi), // instance of called contract
            method: "nftCollection", // Method to be called
            args: [], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }