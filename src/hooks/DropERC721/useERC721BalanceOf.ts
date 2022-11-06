import { Falsy, useCall } from "@usedapp/core";
import { Contract } from "ethers";
import DropERC721 from "../../abi/DropERC721.json"

export default function useERC721BalanceOf(
    contractAddress: string | Falsy,
    address: string | Falsy,
  ) {
    const { value, error } =
      useCall(
        address &&
        contractAddress && {
            contract: new Contract(contractAddress, DropERC721), // instance of called contract
            method: "balanceOf", // Method to be called
            args: [address], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }