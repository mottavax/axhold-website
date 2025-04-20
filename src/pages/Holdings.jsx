import { useEffect, useState } from 'react';
import { JsonRpcProvider, Contract, formatEther, formatUnits } from 'ethers';
import axios from 'axios';
import HoldingsTable from '../components/HoldingsTable';

const TOKENS = [
  '0xFFFF003a6BAD9b743d658048742935fFFE2b6ED7',
  '0x0f669808d88B2b0b3D23214DCD2a1cc6A8B1B5cd'
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
      let allHoldings = [];

      // Fetch token data from DEX Screener
      const tokenData = await fetchDexTokenData();

      for (const wallet of WALLET_ADDRESSES) {
        // Fetch AVAX Balance
        const avaxBalance = await provider.getBalance(wallet);
        const avaxFormatted = avaxBalance ? formatEther(avaxBalance) : "0.00";

        allHoldings.push({
          wallet,
          name: 'Avalanche',
          symbol: 'AVAX',
          balance: parseFloat(avaxFormatted).toFixed(4),
          valueAvax: parseFloat(avaxFormatted).toFixed(4),
          marketCap: 'N/A',
          logoURI: 'https://cryptologos.cc/logos/avalanche-avax-logo.png' // Public AVAX logo
        });

        // Fetch token balances
        for (const tokenAddress of TOKENS) {
          try {
            const tokenContract = new Contract(tokenAddress, [
              "function decimals() view returns (uint8)",
              "function balanceOf(address) view returns (uint)"
            ], provider);

            const decimals = await tokenContract.decimals();
            const balance = await tokenContract.balanceOf(wallet);
            const formattedBalance = balance ? formatUnits(balance, decimals) : "0.00";

            const tokenInfo = tokenData[tokenAddress.toLowerCase()] || {};

            allHoldings.push({
              wallet,
              name: tokenInfo.name || 'Unknown',
              symbol: tokenInfo.symbol || 'UNKNOWN',
              balance: parseFloat(formattedBalance).toFixed(2),
              valueAvax: (formattedBalance * (tokenInfo.priceInAvax || 0)).toFixed(4),
              marketCap: tokenInfo.marketCap ? `$${(tokenInfo.marketCap/1e6).toFixed(2)}M` : 'N/A',
              logoURI: tokenInfo.logoURI || ''
            });
          } catch (tokenError) {
            console.error(`Error fetching token balance:`, tokenError);
          }
        }
      }

      setHoldings(allHoldings);
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
            logoURI: pair.baseToken.logoURI || ''
          };
        }
      } catch (error) {
        console.error(`Error fetching DEX Screener data for token ${address}:`, error);
      }
    }

    return tokenInfoMap;
  }

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">Live Holdings</h1>
      <HoldingsTable holdings={holdings} />
    </section>
  );
}