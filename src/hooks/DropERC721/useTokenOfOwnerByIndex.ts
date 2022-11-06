import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import DropERC721 from "../../abi/DropERC721.json"

export default function useTokenOfOwnerByIndex(
    contractAddress: string | Falsy,
    owner: string | Falsy,
    index: BigNumber | number | Falsy
  ) {
    const { value, error } =
      useCall(
        owner && index &&
        contractAddress && {
            contract: new Contract(contractAddress, DropERC721), // instance of called contract
            method: "tokenOfOwnerByIndex", // Method to be called
            args: [owner, index], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }