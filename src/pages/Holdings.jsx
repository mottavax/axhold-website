import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract, formatUnits } from 'ethers';
import axios from 'axios';
import HoldingsTable from '../components/HoldingsTable';
import TotalsSection from '../components/TotalsSection';

const TOKENS = [
  '0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7',
  '0x0f669808d88B2b0b3D23214DCD2a1cc6A8B1B5cd'
];

const WALLET_ADDRESSES = [
  '0x289B5C1f2727B04BE8127C4F7e5B0380dBbB5f2c',
  '0xCBE1baAE2EF74ffc67062B337aD2e04A02ed9832'
];

const RPC_URL = 'https://api.avax.network/ext/bc/C/rpc';

export default function Holdings() {
  const [holdings, setHoldings] = useState([]);
  const [totals, setTotals] = useState({ totalTokens: 0, totalAvaxValue: 0 });
  const [sortField, setSortField] = useState('valueAvax');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchHoldings();
  }, []);

  async function fetchHoldings() {
    try {
      const provider = new JsonRpcProvider(RPC_URL);
      let allHoldings = [];
      const tokenData = await fetchDexTokenData();

      for (const wallet of WALLET_ADDRESSES) {
        for (const tokenAddress of TOKENS) {
          try {
            const tokenContract = new Contract(tokenAddress, [
              "function decimals() view returns (uint8)",
              "function balanceOf(address) view returns (uint)"
            ], provider);

            const decimals = await tokenContract.decimals();
            const balance = await tokenContract.balanceOf(wallet);
            const formattedBalance = balance ? parseFloat(formatUnits(balance, decimals)) : 0;

            const tokenInfo = tokenData[tokenAddress.toLowerCase()] || {};

            allHoldings.push({
              wallet,
              name: tokenInfo.name || 'Unknown',
              symbol: tokenInfo.symbol || 'UNKNOWN',
              balance: formattedBalance,
              valueAvax: (formattedBalance * (tokenInfo.priceInAvax || 0)),
              marketCap: tokenInfo.marketCap ? `$${(tokenInfo.marketCap/1e6).toFixed(2)}M` : 'N/A',
              priceChange24h: tokenInfo.priceChange24h || 0
            });
          } catch (tokenError) {
            console.error(`Error fetching token balance:`, tokenError);
          }
        }
      }

      setHoldings(allHoldings);
      const tokenTypesHeld = allHoldings.length;
      const totalAvaxValue = allHoldings.reduce((sum, item) => sum + item.valueAvax, 0);
      setTotals({ totalTokens: tokenTypesHeld, totalAvaxValue });
    } catch (error) {
      console.error('Error fetching holdings:', error);
    }
  }

  async function fetchDexTokenData() {
    const tokenInfoMap = {};

    for (const address of TOKENS) {
      try {
        const url = `https://api.dexscreener.com/latest/dex/tokens/${address}`;
        const response = await axios.get(url);
        const pair = response.data.pairs[0];

        if (pair) {
          tokenInfoMap[address.toLowerCase()] = {
            name: pair.baseToken.name,
            symbol: pair.baseToken.symbol,
            priceInAvax: parseFloat(pair.priceNative),
            marketCap: pair.fdv,
            priceChange24h: pair.priceChange?.h24 || 0
          };
        }
      } catch (error) {
        console.error(`Error fetching DEX Screener data for token ${address}:`, error);
      }
    }

    return tokenInfoMap;
  }

  function handleSort(field) {
    const order = (sortField === field && sortOrder === 'asc') ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(order);
    const sortedHoldings = [...holdings].sort((a, b) => {
      if (order === 'asc') {
        return a[field] > b[field] ? 1 : -1;
      } else {
        return a[field] < b[field] ? 1 : -1;
      }
    });
    setHoldings(sortedHoldings);
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Live Holdings</h1>
      <button
        onClick={fetchHoldings}
        className="mb-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        🔄 Refresh Holdings
      </button>
      <TotalsSection totalTokens={totals.totalTokens} totalAvaxValue={totals.totalAvaxValue} />
      <HoldingsTable holdings={holdings} onSort={handleSort} />
    </section>
  );
}
