export default function HoldingsTable({ holdings, onSort }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => onSort('wallet')}>Wallet</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => onSort('symbol')}>Token</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => onSort('balance')}>Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => onSort('valueAvax')}>Value (AVAX)</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer" onClick={() => onSort('marketCap')}>Market Cap</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">24h Change</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length > 0 ? (
            holdings.map((h, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.wallet}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.name} ({h.symbol})</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.valueAvax} AVAX</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.marketCap}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className={h.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {h.priceChange24h ? `${h.priceChange24h.toFixed(2)}%` : '0.00%'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center px-6 py-4 text-sm text-gray-400">
                No holdings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
