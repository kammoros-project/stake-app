import { Falsy, useCall } from "@usedapp/core";
import { Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useBalanceOf(
    contractAddress: string | Falsy,
    address: string | Falsy,
  ) {
    const { value, error } =
      useCall(
        address &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
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