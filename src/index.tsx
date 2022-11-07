import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "./styles/globals.css";
import { desiredChainId, desiredRpc } from "./constants";
import { DAppProvider, Config, CoinbaseWalletConnector, MetamaskConnector } from '@usedapp/core'
import { WalletConnectConnector } from '@usedapp/wallet-connect-connector'

const config: Config = {
  readOnlyChainId: desiredChainId,
  readOnlyUrls: {
    [desiredChainId]: desiredRpc,
  },
  connectors: {
    metamask: new MetamaskConnector(),
    coinbase: new CoinbaseWalletConnector(),
    walletConnect: new WalletConnectConnector({ rpc: { [desiredChainId]: desiredRpc }, chainId: desiredChainId }),
  },
  refresh: "everyBlock"
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <DAppProvider  config={config} >
      <App />
    </DAppProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
