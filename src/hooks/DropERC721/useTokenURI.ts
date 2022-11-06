import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import DropERC721 from "../../abi/DropERC721.json"

export default function useTokenURI(
    contractAddress: string | Falsy,
    tokenId: BigNumber | Falsy
  ) {
    const { value, error } =
      useCall(
        tokenId &&
        contractAddress && {
            contract: new Contract(contractAddress, DropERC721), // instance of called contract
            method: "tokenURI", // Method to be called
            args: [tokenId], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }