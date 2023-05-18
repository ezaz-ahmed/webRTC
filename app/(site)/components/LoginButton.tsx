'use client';

import { PublicKey, Transaction } from '@solana/web3.js';
import { useState, useEffect } from 'react';
import PhantomLogo from '../assets/PhantomLogo';

type DisplayEncoding = 'utf8' | 'hex';
type WalletKey = 'string' | undefined;
type PhantomEvent = 'disconnect' | 'connect' | 'accountChanged';
type PhantomRequestMethod =
  | 'connect'
  | 'disconnect'
  | 'signTransaction'
  | 'signAllTransactions'
  | 'signMessage';

interface ConnectOpts {
  onlyIfTrusted: boolean;
}

interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const LoginButton = () => {
  const [walletKey, setWalletKey] = useState<WalletKey>(undefined);
  const [provider, setProvider] = useState<PhantomProvider | undefined>(
    undefined
  );

  useEffect(() => {
    const provider = getProvider();

    if (provider) setProvider(provider);
    else setProvider(undefined);
  }, []);

  const getProvider = (): PhantomProvider | undefined => {
    if ('solana' in window) {
      const provider = window.solana as any;
      if (provider.isPhantom) return provider as PhantomProvider;
    }
  };

  const connectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (solana) {
      try {
        const response = await solana.connect();

        setWalletKey(response.publicKey.toString());
      } catch (err) {
        // TODO  { code: 4001, message: 'User rejected the request.' }
      }
    }
  };

  const disconnectWallet = async () => {
    // @ts-ignore
    const { solana } = window;

    if (walletKey && solana) {
      await (solana as PhantomProvider).disconnect();
      setWalletKey(undefined);
    }
  };

  return (
    <div className='flex min-h-screen flex-col items-center justify-between p-24'>
      {walletKey && <p>Connected account {walletKey}</p>}

      {provider && !walletKey && (
        <button className='btn gap-2' onClick={connectWallet}>
          <PhantomLogo /> Login With Phantom Wallet
        </button>
      )}

      {provider && walletKey && (
        <div>
          <button className='btn gap-2' onClick={disconnectWallet}>
            <PhantomLogo /> Disconnect
          </button>
        </div>
      )}

      {!provider && (
        <a
          href='https://phantom.app/download'
          className=' btn gap-2'
          target='_blank'
        >
          <PhantomLogo /> Download Phantom Wallet
        </a>
      )}
    </div>
  );
};

export default LoginButton;
