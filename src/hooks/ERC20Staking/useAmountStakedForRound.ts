import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useAmountStakedForRound(
    contractAddress: string | Falsy,
    index: BigNumber | Falsy,
  ): BigNumber | undefined {
    const { value, error } =
      useCall(
        index &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
            method: "amountStakedForRound", // Method to be called
            args: [BigNumber.from(index)], // Method arguments
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }