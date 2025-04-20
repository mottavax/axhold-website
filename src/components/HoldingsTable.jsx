export default function HoldingsTable({ holdings }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Wallet</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Token</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Balance</th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Value (AVAX)</th>
          </tr>
        </thead>
        <tbody>
          {holdings.length > 0 ? (
            holdings.map((h, index) => (
              <tr key={index} className="border-t border-gray-200 dark:border-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.wallet}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.symbol}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.balance}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{h.avaxValue || '0.0000'} AVAX</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center px-6 py-4 text-sm text-gray-400">
                No holdings found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}