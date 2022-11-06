import { Contract, ethers } from "ethers";
import { useForm, SubmitHandler } from "react-hook-form";
import { FaArrowAltCircleUp, FaCheckCircle, FaHandPointUp, FaTimes } from "react-icons/fa"
import { tokenStakingAddress } from "../../../constants";
import ERC20Staking from "../../../abi/ERC20Staking.json"
import ERC20 from "../../../abi/KMCToken.json"
import { FaSpinner } from "react-icons/fa"
import { useEffect } from "react";
import { formatCommify } from "../../../support/formatters";
import { useContractFunction, useEthers, useTokenAllowance, useTokenBalance } from "@usedapp/core";
import useToken from "../../../hooks/ERC20Staking/useToken";
import StateDialog from "../../dialogs/StateDialog";

type Inputs = {
    amount: string,
};

export default function TokenDepositForm() {

    const { account } = useEthers()
    const tokenAddress = useToken(tokenStakingAddress)
    const balanceOf = useTokenBalance(tokenAddress, account)
    const allowance = useTokenAllowance(tokenAddress, account, tokenStakingAddress)

    const stakingContract = new Contract(tokenStakingAddress, ERC20Staking.abi)
    const tokenContract = new Contract(tokenAddress, ERC20.abi)

    const { state: stateApproval, send: approve } = useContractFunction(tokenContract, 'approve', { transactionName: 'Approve' })
    const { state: stateDeposit, send: depositToken } = useContractFunction(stakingContract, 'depositToken', { transactionName: 'Deposit' })

    const { register, handleSubmit, setValue, setFocus, watch, formState: { errors } } = useForm<Inputs>();

    // const [amount, setAmount] = useState<BigNumber>()

    const amount = watch("amount")

    async function sendApprove() {
        await approve(tokenStakingAddress, ethers.constants.MaxUint256)
    }

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        if (!balanceOf) return
        if (!allowance) return
        const amount = ethers.utils.parseEther(data.amount)
        if (amount.lte(0)) return
        await depositToken(amount)
    };

    function setMax() {
        if (balanceOf) {
            setValue("amount", ethers.utils.formatEther(balanceOf))
        }
    }

    useEffect(() => {
        setFocus("amount")
    }, [setFocus])


    if (stateApproval.status === "PendingSignature") {
        return (<StateDialog
            heading="Approve Token Transfer"
            icon={<FaHandPointUp className="animate-pulse h-6 w-6" />}
            subheading={formatCommify(amount)}
            description="Confirm this transaction in your wallet"
        />)
    }

    if (stateApproval.status === "Mining") {
        return (<StateDialog
            heading="Mining Approval"
            icon={<FaSpinner className="animate-spin h-6 w-6" />}
            subheading={formatCommify(amount)}
            description="Your transaction is processing"
        />)
    }

    if (stateApproval.status === "Fail") {
        return (<StateDialog
            heading="Approval Failed"
            icon={<FaTimes className="h-6 w-6" />}
            subheading={stateApproval.transaction?.hash}
            description={stateApproval.errorMessage}
        />)
    }

    if (stateDeposit.status === "PendingSignature") {
        return (<StateDialog
            heading="Deposit Tokens"
            icon={<FaHandPointUp className="animate-pulse h-6 w-6" />}
            subheading={formatCommify(amount)}
            description="Confirm this transaction in your wallet"
        />)
    }

    if (stateDeposit.status === "Mining") {
        return (<StateDialog
            heading="Mining Deposit"
            icon={<FaSpinner className="animate-spin h-6 w-6" />}
            subheading={formatCommify(amount)}
            description="Your transaction is processing"
        />)
    }

    if (stateDeposit.status === "Fail") {
        return (<StateDialog
            heading="Deposit Failed"
            icon={<FaTimes className="h-6 w-6" />}
            subheading={stateApproval.transaction?.hash}
            description={stateApproval.errorMessage}
        />)
    }

    if (stateDeposit.status === "Success") {
        return (<StateDialog
            heading="Deposit Succeeded"
            icon={<FaCheckCircle className="text-emerald-500 h-6 w-6" />}
            subheading="Tokens successfully deposited"
            description={stateDeposit.transaction?.hash}
        />)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-400 uppercase">
                <label>Amount</label>
                <span>Balance: {formatCommify(balanceOf)}</span>
            </div>
            <div className="flex">
                <input autoFocus={true} {...register("amount", { required: true })} className="w-full outline-0 border-2 border-r-0 border-emerald-500 text-3xl py-1 px-2 rounded-l-md rounded-r-none text-slate-600" />
                <button className="text-xl font-semibold text-white py-1 px-4 bg-emerald-500 rounded-r-md hover:border-emerald-500 hover:bg-emerald-400 disabled:bg-slate-500" onClick={() => setMax()} type="button">MAX</button>
            </div>
            {errors.amount && <span>This field is required</span>}

            <div className="flex gap-4">

                {allowance && amount && allowance?.lt(ethers.utils.parseEther(amount)) &&
                    <button type={"button"} onClick={() => sendApprove()} className="grow text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400">
                        <div className="flex items-center justify-center gap-2">
                            <span>Approve</span>
                        </div>
                    </button>
                }

                <button type="submit" className="grow text-xl font-semibold text-white py-3 px-4 bg-emerald-500 rounded-md hover:border-emerald-500 hover:bg-emerald-400 disabled:bg-slate-400" disabled={!allowance || !amount || allowance.lt(ethers.utils.parseEther(amount))}>
                    <div className="flex items-center justify-center gap-2">
                        <FaArrowAltCircleUp className="h-4" />
                        <span>Deposit</span>
                    </div>
                </button>
            </div>


        </form>
    );
}