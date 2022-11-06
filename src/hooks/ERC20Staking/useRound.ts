import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useRound(
    contractAddress: string | Falsy,
    index: BigNumber | Falsy
  ) {
    const { value, error } =
      useCall(
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
            method: "rounds", // Method to be called
            args: [index], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value
  }