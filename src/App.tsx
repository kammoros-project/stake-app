import { desiredChainId, nftStakingContracts } from "./constants";
import { Tab } from '@headlessui/react'
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import { ConnectWallet, useAddress, useChainId } from "@thirdweb-dev/react";
import NFTWrapper from "./components/nft/NFTWrapper";
import TokenWrapper from "./components/tokens/TokenWrapper";
import IncorrectChain from "./components/support/IncorrectChain";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

interface IAppTab {
  text: string
}

function AppTab({ text }: IAppTab) {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'w-full rounded-lg p-2 text-xs md:text-sm font-medium leading-5 text-slate-700 outline-0',
          selected
            ? 'bg-white shadow'
            : 'text-slate-100 hover:bg-white/[0.12] hover:text-white'
        )
      }
    >
      <span>{text}</span>
    </Tab>
  )
}

export default function App() {

  const address = useAddress()
  const chainId = useChainId()

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-800">
      <div className="flex flex-col gap-8">
        <Header />
        <Container>
          {chainId && chainId === desiredChainId ?
            <>
              {address ?
                <Tab.Group>
                  <Tab.List className="flex justify-center space-x-1 rounded-xl bg-slate-900/20 p-1 w-full mx-auto mb-16">
                    <AppTab text="KMC Token" />
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
                </Tab.Group> :
                <div className="flex flex-col items-center gap-4">
                  <p className="text-slate-50 animate-pulse">Please connect your wallet.</p>
                  <div className="max-w-64"><ConnectWallet accentColor="#f97316" colorMode="light" /></div>
                </div>}
            </> : <IncorrectChain />}
        </Container>
      </div>
      <Footer />
    </div>
  );
}
