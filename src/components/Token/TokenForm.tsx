import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useState } from "react";
import { useForm } from "react-hook-form";
import KMCToken from "../../abi/KMCToken.json"
import Spin from "../support/Spin";

interface ITokenForm {
    stakingContract: any
}

function TokenForm({ stakingContract }: ITokenForm) {

    const address = useAddress()
    const { data: tokenAddress } = useContractRead(stakingContract, "token")
    const { contract: tokenContract } = useContract(tokenAddress, KMCToken.abi)
    const { data: balance } = useContractRead(tokenContract, "balanceOf", address)
    const { data: allowance } = useContractRead(tokenContract, "allowance", address, stakingContract.getAddress())
    const { mutateAsync: depositToken } = useContractWrite(stakingContract, "depositToken")
    const { mutateAsync: approve } = useContractWrite(tokenContract, "approve")

    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const { register, setValue, handleSubmit } = useForm();
    async function onSubmit(data: any) {
        if (!address) return
        if (!balance) return
        if (!allowance) return

        setIsSubmitting(true)

        const amount = ethers.utils.parseEther(data.amount)

        if ((allowance as BigNumber).lt(balance)) {
            await approve([stakingContract.getAddress(), amount])
        }

        await depositToken([amount])

        setIsSubmitting(false)
    }

    function setMax() {
        setValue("amount", ethers.utils.formatEther(balance))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
            <div className="flex gap-4">
                <div className="grow flex flex-col bg-white/10 p-4 gap-2">
                    <div className="flex justify-between text-slate-400 text-sm">
                        <div className="text-xs">Amount</div>
                        {balance ? <div className="text-xs">Balance: {ethers.utils.formatEther(balance)}</div> : <></>}
                    </div>
                    <div className="flex items-center">
                        <div className="grow flex flex-col gap-2">
                            <input defaultValue={"0"} type={"number"} {...register("amount", { required: true })} className="outline-0 text-xl bg-transparent text-white" />
                        </div>
                        <div className="flex items-end gap-2">
                            <button className="font-semibold text-emerald-500 py-1 px-2 border-2 border-emerald-500 rounded hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-50/10" onClick={() => setMax()} type="button">MAX</button>
                            <button className="font-semibold text-emerald-50 py-1 px-2 border-2 border-emerald-500 bg-emerald-500 uppercase rounded hover:border-emerald-400 hover:bg-emerald-400" type="submit">
                                <div className="flex items-center gap-2">
                                    {isSubmitting ? <Spin /> : <></>}
                                    <span>Stake</span>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}

export default TokenForm