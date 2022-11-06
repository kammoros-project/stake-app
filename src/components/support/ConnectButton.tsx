import { Menu, Transition } from "@headlessui/react"
import { shortenIfAddress, useEtherBalance, useEthers } from "@usedapp/core"
import metamask from "../../assets/metamask.svg"
import walletconnect from "../../assets/walletconnect.svg"
import trustwallet from "../../assets/trustwallet.svg"
import { formatCommify } from "../../support/formatters"


const menuItemClass = "group flex w-full items-center rounded px-2 py-2 text-sm text-slate-600 hover:bg-slate-200 hover:text-slate-900"

export default function ConnectButton() {
    const { activateBrowserWallet, account, deactivate } = useEthers()
    const etherBalance = useEtherBalance(account)

    if (!account) {
        return (
            <Menu>
                <Menu.Button className={"inline-flex w-full justify-center rounded-md bg-emerald-500 text-slate-900 px-4 py-2 text-sm font-semibold uppercase text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"}>Connect</Menu.Button>
                <Transition
                    enter="transition duration-100 ease-out"
                    enterFrom="transform scale-95 opacity-0"
                    enterTo="transform scale-100 opacity-100"
                    leave="transition duration-75 ease-out"
                    leaveFrom="transform scale-100 opacity-100"
                    leaveTo="transform scale-95 opacity-0"
                >
                    <Menu.Items className={"absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"}>
                        <div className="p-1 flex flex-col">
                            <Menu.Item as={"button"} className={menuItemClass} onClick={() => activateBrowserWallet({ type: 'metamask' })}>
                                <img src={metamask} alt="metamask" className="w-6 h-6 mr-2" />
                                <span>Metamask</span>
                            </Menu.Item>
                            <Menu.Item as={"button"} className={menuItemClass} onClick={() => activateBrowserWallet({ type: 'metamask' })}>
                                <img src={trustwallet} alt="trustwallet" className="w-6 h-6 mr-2" />
                                <span>TrustWallet</span>
                            </Menu.Item>
                            <Menu.Item as={"button"} className={menuItemClass} onClick={() => activateBrowserWallet({ type: 'walletConnect' })}>
                                <img src={walletconnect} alt="walletconnect" className="w-6 h-6 mr-2" />
                                <span>WalletConnect</span>
                            </Menu.Item>
                        </div>
                    </Menu.Items></Transition>
            </Menu>
        )
    }

    return (
        <div className="flex gap-2 items-center">
            <div className="flex items-center flex space-x-2 divide-x text-xs font-mono">
                <div>{shortenIfAddress(account)}</div>
                <div className="pl-2">{ etherBalance && formatCommify(etherBalance, 5) }</div>
            </div>
            <button onClick={() => deactivate()} className="rounded-md bg-orange-500 text-slate-900 px-4 py-2 text-sm font-semibold uppercase text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">Disconnect</button>
        </div>
    )
}