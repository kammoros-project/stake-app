import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useAmountStakedForRound(
    contractAddress: string | Falsy,
    index: number | BigNumber | Falsy,
  ): BigNumber | undefined {
    // console.log(contractAddress, index)
    const { value, error } =
      useCall(
        index &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
            method: "amountStakedForRound", // Method to be called
            args: [index], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    // console.log("useAmountStakedForRound", value)
    return value?.[0]
  }