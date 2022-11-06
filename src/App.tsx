import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Container from "./components/layout/Container";
import IncorrectChain from "./components/support/IncorrectChain";
import { useConfig, useEthers } from "@usedapp/core";
import NoWallet from "./components/support/NoWallet";
import AppTabs from "./components/layout/AppTabs";

export default function App() {

  const { chainId, account } = useEthers()
  const config = useConfig()

  function isCorrectChain(): boolean {
    return config.readOnlyChainId === chainId
  }

  function isConnected(): boolean {
    return account !== undefined && account !== ""
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-800">
      <div className="flex flex-col gap-8">
        <Header />
        <Container>
          <>
            { isConnected() && isCorrectChain () && <AppTabs />}
            { isConnected() && !isCorrectChain() && <IncorrectChain />}
            { !isConnected() && <NoWallet />}
          </>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
