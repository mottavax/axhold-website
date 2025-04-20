import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract, formatEther, formatUnits } from 'ethers';
import axios from 'axios';
import HoldingsTable from '../components/HoldingsTable';

const TOKENS = [
  {
    address: '0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7',
    symbol: 'AXT'
  },
  {
    address: '0x0f669808d88B2b0b3D23214DCD2a1cc6A8B1B5cd',
    symbol: 'NEW'
  }
];

const WALLET_ADDRESSES = [
  '0x289B5C1f2727B04BE8127C4F7e5B0380dBbB5f2c'
];

const RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    fetchHoldings();
  }, []);

  async function fetchHoldings() {
    try {
      const provider = new JsonRpcProvider(RPC_URL);
      const prices = await fetchPrices();
      let allHoldings = [];

      for (const wallet of WALLET_ADDRESSES) {
        try {
          const avaxBalance = await provider.getBalance(wallet);
          const avaxFormatted = avaxBalance ? formatEther(avaxBalance) : "0.00";
          allHoldings.push({
            wallet,
            symbol: 'AVAX',
            balance: parseFloat(avaxFormatted).toFixed(4),
            usdValue: `$${(avaxFormatted * prices.avax).toFixed(2)}`
          });

          for (const token of TOKENS) {
            try {
              const tokenContract = new Contract(token.address, [
                "function decimals() view returns (uint8)",
                "function balanceOf(address) view returns (uint)"
              ], provider);
              const decimals = await tokenContract.decimals();
              const tokenBalance = await tokenContract.balanceOf(wallet);
              const tokenFormatted = tokenBalance ? formatUnits(tokenBalance, decimals) : "0.00";

              allHoldings.push({
                wallet,
                symbol: token.symbol,
                balance: parseFloat(tokenFormatted).toFixed(2),
                usdValue: `$${(tokenFormatted * (prices[token.address.toLowerCase()] || 0)).toFixed(2)}`
              });
            } catch (tokenError) {
              console.error(`Error fetching token balance for ${token.symbol}:`, tokenError);
            }
          }
        } catch (walletError) {
          console.error(`Error fetching AVAX balance for ${wallet}:`, walletError);
        }
      }

      setHoldings(allHoldings);
    } catch (error) {
      console.error("Error fetching holdings:", error);
      setHoldings([]);
    }
  }

  async function fetchPrices() {
    try {
      const avaxPriceReq = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd');
      const tokenPriceReq = axios.get('https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7,0x0f669808d88B2b0b3D23214DCD2a1cc6A8B1B5cd&vs_currencies=usd');

      const [avaxRes, tokenRes] = await Promise.all([avaxPriceReq, tokenPriceReq]);
      return {
        avax: avaxRes.data['avalanche-2'].usd,
        '0xffff003a6bad9b743d658048742935fffe2b6ed7': tokenRes.data['0xffff003a6bad9b743d658048742935fffe2b6ed7']?.usd || 0,
        '0x0f669808d88b2b0b3d23214dcd2a1cc6a8b1b5cd': tokenRes.data['0x0f669808d88b2b0b3d23214dcd2a1cc6a8b1b5cd']?.usd || 0
      };
    } catch (priceError) {
      console.error("Error fetching prices:", priceError);
      return {
        avax: 0,
        '0xffff003a6bad9b743d658048742935fffe2b6ed7': 0,
        '0x0f669808d88b2b0b3d23214dcd2a1cc6a8b1b5cd': 0
      };
    }
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Live Holdings</h1>
      <HoldingsTable holdings={holdings} />
    </section>
  );
}