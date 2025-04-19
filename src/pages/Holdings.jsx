import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract, formatEther, formatUnits } from 'ethers';
import axios from 'axios';
import HoldingsTable from '../components/HoldingsTable';

const TOKEN_ADDRESS = '0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7';
const WALLET_ADDRESSES = [
  '0xCBE1baAE2EF74ffc67062B337aD2e04A02ed9832'
];
const RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    fetchHoldings();
  }, []);

  async function fetchHoldings() {
    const provider = new JsonRpcProvider(RPC_URL);
    const prices = await fetchPrices();
    let allHoldings = [];

    for (const wallet of WALLET_ADDRESSES) {
      // Fetch AVAX balance
      const avaxBalance = await provider.getBalance(wallet);
      const avaxFormatted = formatEther(avaxBalance);
      allHoldings.push({
        wallet,
        symbol: 'AVAX',
        balance: parseFloat(avaxFormatted).toFixed(4),
        usdValue: `$${(avaxFormatted * prices.avax).toFixed(2)}`
      });

      // Fetch Token balance
      const tokenContract = new Contract(TOKEN_ADDRESS, [
        "function decimals() view returns (uint8)",
        "function balanceOf(address) view returns (uint)"
      ], provider);
      const decimals = await tokenContract.decimals();
      const tokenBalance = await tokenContract.balanceOf(wallet);
      const tokenFormatted = formatUnits(tokenBalance, decimals);
      allHoldings.push({
        wallet,
        symbol: 'AXT',
        balance: parseFloat(tokenFormatted).toFixed(2),
        usdValue: `$${(tokenFormatted * prices.token).toFixed(2)}`
      });
    }

    setHoldings(allHoldings);
  }

  async function fetchPrices() {
    const avaxPriceReq = axios.get('https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd');
    const tokenPriceReq = axios.get('https://api.coingecko.com/api/v3/simple/token_price/avalanche?contract_addresses=0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7&vs_currencies=usd');

    const [avaxRes, tokenRes] = await Promise.all([avaxPriceReq, tokenPriceReq]);
    return {
      avax: avaxRes.data['avalanche-2'].usd,
      token: tokenRes.data['0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7'].usd || 0
    };
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Live Holdings</h1>
      <HoldingsTable holdings={holdings} />
    </section>
  );
}