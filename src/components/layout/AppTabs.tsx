import { Tab } from "@headlessui/react";
import { nftStakingContracts } from "../../constants";
import NFTWrapper from "../nft/NFTWrapper";
import TokenWrapper from "../tokens/TokenWrapper";
import AppTab from "./AppTab";

export default function AppTabs() {
    return (
        <Tab.Group>
            <Tab.List className="flex justify-center space-x-1 rounded-xl bg-slate-900/20 p-1 w-full mx-auto mb-16">
                <AppTab text="KMC" />
                {nftStakingContracts.map((tab, key) => (
                    <AppTab text={tab.name} key={key} />
                ))}
            </Tab.List>
            <Tab.Panels className="mt-2">
                <Tab.Panel>
                    <TokenWrapper />
                </Tab.Panel>
                {nftStakingContracts.map((contract, key) => (
                    <Tab.Panel key={key} >
                        <NFTWrapper contractAddress={contract.address} />
                    </Tab.Panel>
                ))}
            </Tab.Panels>
        </Tab.Group>
    )
}