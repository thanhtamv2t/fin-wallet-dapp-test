import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { SeiWalletProvider } from '@sei-js/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SeiWalletProvider
      chainConfiguration={{
        chainId: 'atlantic-2',
        restUrl: 'https://rest.atlantic-2.seinetwork.io/',
        rpcUrl: 'https://rpc.atlantic-2.seinetwork.io'
      }}>
      <App />
    </SeiWalletProvider>
  </React.StrictMode>,
)
