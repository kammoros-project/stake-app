import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useAmountStakedForRoundByAddress(
    contractAddress: string | Falsy,
    index: BigNumber | Falsy,
    address: string | Falsy
  ): BigNumber | undefined {
    const { value, error } =
      useCall(
        index && address &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
            method: "amountStakedForRoundByAddress", // Method to be called
            args: [index, address], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    // console.log("useAmountStakedForRoundByAddress", value)
    return value?.[0]
  }