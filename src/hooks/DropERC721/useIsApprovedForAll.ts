import { Falsy, useCall } from "@usedapp/core";
import { Contract } from "ethers";
import DropERC721 from "../../abi/DropERC721.json"

export default function useIsApprovedForAll(
    contractAddress: string | Falsy,
    owner: string | Falsy,
    operator: string | Falsy
  ) {
    const { value, error } =
      useCall(
        owner && operator &&
        contractAddress && {
            contract: new Contract(contractAddress, DropERC721), // instance of called contract
            method: "isApprovedForAll", // Method to be called
            args: [owner, operator], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }