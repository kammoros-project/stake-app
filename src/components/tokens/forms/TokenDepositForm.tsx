import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowAltCircleUp, FaCheckCircle } from "react-icons/fa"
import { tokenStakingAddress } from "../../../contracts";
import ERC20Staking from "../../../abi/ERC20Staking.json"
import ERC20 from "../../../abi/KMCToken.json"
import { FaSpinner } from "react-icons/fa"
import { TransactionError } from "@thirdweb-dev/sdk";
import { useEffect, useState } from "react";
import { formatCommify } from "../../../support/formatters";

type Inputs = {
    amount: string,
};

export default function TokenDepositForm() {

    const address = useAddress()
    const { contract: tokenStakingContract } = useContract(tokenStakingAddress, ERC20Staking.abi)
    const { data: tokenAddress } = useContractRead(tokenStakingContract, "token");
    const { contract: tokenContract } = useContract(tokenAddress, ERC20.abi)
    const { data: balanceOf } = useContractRead(tokenContract, "balanceOf", address);

    const { data: allowance } = useContractRead(tokenContract, "allowance", address, tokenStakingAddress)
    const { mutateAsync: approve, status: approvalStatus, error: approvalError } = useContractWrite(tokenContract, "approve");
    const { mutateAsync: depositToken, status: depositStatus, error: depositError } = useContractWrite(tokenStakingContract, "depositToken");

    const { register, handleSubmit, setValue, setFocus, formState: { errors } } = useForm<Inputs>();

    const [amount, setAmount] = useState<BigNumber>()

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!address) return
        if (!balanceOf) return
        if (!allowance) return

        const amount = ethers.utils.parseEther(data.amount)
        if (amount.lte(0)) return
        setAmount(amount)

        if ((allowance as BigNumber).lt(balanceOf)) {
            await approve([tokenStakingAddress, ethers.constants.MaxUint256])
        }
        await depositToken([amount])
    };

    function setMax() {
        setValue("amount", ethers.utils.formatEther(balanceOf))
    }

    useEffect(() => {
        setFocus("amount")
    }, [setFocus])

    if (approvalStatus === "loading") {
        return (
            <div className="flex flex-col gap-4 items-center text-center mb-8">
                <h4 className="text-sm text-slate-400 uppercase">Step 1 of 2</h4>
                <FaSpinner className="animate-spin h-6 w-6" />
                <h3 className="font-semibold uppercase text-slate-900">Approve Token Spend</h3>
                <h4 className="font-semibold uppercase text-slate-900">{formatCommify(amount)}</h4>
                <p className="text-slate-400">Confirm this transaction in your wallet</p>
            </div>
        )
    }

    if (approvalStatus === "error") {
        return (
            <div className="flex flex-col gap-4 items-center text-center mb-8">
                <h4 className="text-sm text-slate-400 uppercase">Error</h4>
                <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
                <p className="text-slate-400 w-full text-xs font-mono">
                    {(approvalError as TransactionError).toString()}
                </p>
            </div>
        )
    }

    if (depositStatus === "loading") {
        return (
            <div className="flex flex-col gap-4 items-center text-center mb-8">
                <h4 className="text-sm text-slate-400 uppercase">Step 2 of 2</h4>
                <FaSpinner className="animate-spin h-6 w-6" />
                <h3 className="font-semibold uppercase text-slate-900">Deposit Tokens</h3>
                <h4 className="font-semibold uppercase text-slate-900">{formatCommify(amount)}</h4>
                <p className="text-slate-400">Confirm this transaction in your wallet</p>
            </div>
        )
    }

    if (depositStatus === "error") {
        return (
            <div className="flex flex-col gap-4 items-center text-center mb-8">
                <h4 className="text-sm text-slate-400 uppercase">Error</h4>
                <h3 className="font-semibold uppercase text-red-900">Oops! Something went wrong.</h3>
                <p className="text-slate-400 w-full text-xs font-mono">
                    {(depositError as TransactionError).toString()}
                </p>
            </div>
        )
    }

    if (depositStatus === "success") {
        return (
            <div className="flex flex-col gap-4 items-center text-center mb-8">
                <h4 className="text-sm text-slate-400 uppercase">Congratulations</h4>
                <FaCheckCircle className="text-emerald-500 h-6 w-6" />
                <h3 className="font-semibold uppercase text-emerld-900">Deposited Tokens</h3>
                <h4 className="font-semibold uppercase text-slate-900">{formatCommify(amount)}</h4>
                <p className="text-slate-400">View your deposit in the Deposits section.</p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase">
                <label>Amount</label>
                <span>Balance: {formatCommify(balanceOf)}</span>
            </div>

            <div className="flex">
                <input autoFocus={true} {...register("amount", { required: true })} className="grow outline-0 border-2 border-r-0 border-emerald-500 text-3xl py-1 px-2 rounded-l-md text-slate-600" />
                <button className="text-xl font-semibold text-white py-1 px-4 bg-emerald-500 rounded-r-md hover:border-emerald-500 hover:bg-emerald-400 disabled:bg-slate-500" onClick={() => setMax()} type="button">MAX</button>
            </div>

            {errors.amount && <span>This field is required</span>}

            <button type="submit" className="text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400">
                <div className="flex items-center justify-center gap-2">
                    <FaArrowAltCircleUp className="h-4" />
                    <span>Deposit</span>
                </div>
            </button>

        </form>
    );
}