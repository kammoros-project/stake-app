import { Falsy, useCall } from "@usedapp/core";
import { BigNumber, Contract } from "ethers";
import ERC20Staking from "../../abi/ERC20Staking.json"

export default function useETHUnclaimedForRoundByAddress(
    contractAddress: string | Falsy,
    roundIndex: BigNumber | Falsy,
    address: string | Falsy
  ) {
    const { value, error } =
      useCall(
        roundIndex && address &&
        contractAddress && {
            contract: new Contract(contractAddress, ERC20Staking.abi), // instance of called contract
            method: "ethUnclaimedForRoundByAddress", // Method to be called
            args: [roundIndex, address], // Method arguments - address to be checked for balance
          }
      ) ?? {};
    if(error) {
      console.error(error.message)
      return undefined
    }
    return value?.[0]
  }