import { makeSignDoc } from '@cosmjs/launchpad';
import './App.css'
import { useSigningCosmWasmClient, useWallet, WalletConnectButton } from '@sei-js/react'
import { TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { useRef, useState } from 'react';
import { ObjectView } from 'react-object-view'
import { Buffer } from 'buffer/'

function App() {
  const { accounts, connectedWallet, chainId } = useWallet();
  const { signingCosmWasmClient } = useSigningCosmWasmClient()

  const [logs, setLogs] = useState([])

  const logRef = useRef()

  const makeDoc = () => {
    const signer = accounts[0].address

    const msgs = [
      {
        type: 'cosmos-sdk/MsgSend',
        value: {
          amount: [
            {
              amount: 10000,
              denom: 'ueura'
            }
          ],
          from_address: signer,
          to_address: signer
        }
      }
    ]

    const fee = {
      amount: [{ amount: '2000', denom: 'ueura' }],
      gas: '200000'
    }
    const aDocToSign = makeSignDoc(msgs, fee, chainId, 'Some Memo', '269', '17')
    return aDocToSign
  }

  const onSignArbitrary = async () => {
    const hash = await window.fin.signArbitrary("atlantic-2", accounts[0].address, "Some data goes here")

    log(hash)
  }

  const onSignAmino = async () => {
    const doc = makeDoc();

    const signed = await window.fin.signAmino(chainId, accounts[0].address, doc)

    log(signed)

  }

  const onSignDirect = async () => {
    const test = await signingCosmWasmClient.sendTokens(accounts[0]?.address, accounts[0]?.address, [
      {
        amount: "1",
        denom: "usei"
      }
    ], {
      amount: [
        {
          amount: "1",
          denom: "usei"
        }
      ],
      gas: '250000'
    })
    log(test)
  }

  const onSendTx = async () => {

    const signer = accounts[0].address

    const sendMsg = {
      typeUrl: "/cosmos.bank.v1beta1.MsgSend",
      value: {
        fromAddress: signer,
        toAddress: signer,
        amount: [{
          amount: '10000',
          denom: "sei"
        }],
      },
    };

    const signedTx = await signingCosmWasmClient.sign(signer, [sendMsg], {
      amount: [{
        amount: '1000',
        denom: "usei"
      }],
      gas: "250000"
    })

    const rawTx = TxRaw.encode(signedTx).finish();

    const tx = await window.fin.sendTx(chainId, rawTx, "sync");


    const hashString = Buffer.from(tx).toString("hex").toUpperCase()

    log(hashString)
  }

  const log = (content) => {
    setLogs(prev => [ {
      date: new Date(),
      content: content
    },...prev])
  }

  return (
    <>
      <div>
        <WalletConnectButton wallets={["fin", "coin98", "keplr"]} />

        {connectedWallet && (
          <>
            <div style={{ marginTop: 12 }}>
              <div style={{ marginBottom: 12 }} onClick={onSignAmino}>
                <button className="btn">Test Sign Amino</button>
              </div>

              <div style={{ marginBottom: 12 }} onClick={onSignDirect}>
                <button className="btn">Test Sign Direct</button>
              </div>

              <div style={{ marginBottom: 12 }} onClick={onSignArbitrary}>
                <button className="btn">Test Sign Arbitrary</button>
              </div>

              <div>
                <button className="btn" onClick={onSendTx}>Test Send Tx</button>
              </div>


            </div>
            <div className="logger" style={{ height: "250px", backgroundColor: "#fafafa", color: "#000", textAlign: "left", overflow: "auto", padding: 24, marginTop: 24, borderRadius: 8, width: "80vw" }} ref={logRef}>
              {logs.map(it => {
                return <div key={it.date.toString()} style={{ marginBottom: 12 }}>
                  <div>
                    <div>
                      <div style={{ display: "inline-block", background: "#00C8B9", color: "#FFF", padding: 4 }}>
                        {new Date(it.date).toISOString()}:
                      </div>
                    </div>
                    <div>
                      {typeof it.content === "object" ? <ObjectView data={it.content} /> : it.content}
                    </div>
                  </div>
                </div>
              })}
            </div>
          </>
        )}





      </div>
    </>
  )
}

export default App
