import contracts from "./contracts";
import { Tab } from '@headlessui/react'
import NFTStakingTable from "./components/nft/NFTStakingTable";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import TokenStakingTable from "./components/Token/TokenStakingTable";
import NotificationCenter from "./components/support/NotificationCenter";
import NotificationProvider from "./providers/NotificationProvider";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col justify-between bg-slate-800">
        <div className="flex flex-col gap-8">
          <Header />
          <Container>
            <NotificationCenter />
            <Tab.Group>
              <Tab.List className="flex justify-center space-x-1 rounded-xl bg-slate-900/20 p-1 w-full mx-auto mb-16">
                {contracts.map((tab, key) => (
                  <Tab
                    key={key}
                    className={({ selected }) =>
                      classNames(
                        'w-full rounded-lg p-2 text-xs md:text-sm font-medium leading-5 text-slate-700 outline-0',
                        selected
                          ? 'bg-white shadow'
                          : 'text-slate-100 hover:bg-white/[0.12] hover:text-white'
                      )
                    }
                  >
                    {tab.name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-2">
                {contracts.map((contract, key) => (
                  <Tab.Panel key={key} >
                    {contract.nft ? <NFTStakingTable contractAddress={contract.address} /> : <TokenStakingTable contractAddress={contract.address} />}
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </Container>
        </div>
        <Footer />
      </div>
    </NotificationProvider>
  );
}
