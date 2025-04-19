export default function HoldingsTable({ holdings }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Wallet</th>
            <th className="px-4 py-2 border-b">Token</th>
            <th className="px-4 py-2 border-b">Balance</th>
            <th className="px-4 py-2 border-b">USD Value</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h, idx) => (
            <tr key={idx} className="hover:bg-gray-100 dark:hover:bg-gray-700">
              <td className="px-4 py-2 border-b">{h.wallet}</td>
              <td className="px-4 py-2 border-b">{h.symbol}</td>
              <td className="px-4 py-2 border-b">{h.balance}</td>
              <td className="px-4 py-2 border-b">{h.usdValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}