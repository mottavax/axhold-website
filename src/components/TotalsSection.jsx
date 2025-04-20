export default function TotalsSection({ totalTokens, totalAvaxValue }) {
  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg shadow mb-8 text-center">
      <h2 className="text-2xl font-bold mb-2">Community Holdings Summary</h2>
      <p className="text-lg">Total Tokens Held: <span className="font-semibold">{totalTokens.toLocaleString()} Tokens</span></p>
      <p className="text-lg">Total Value: <span className="font-semibold">{totalAvaxValue.toFixed(4)} AVAX</span></p>
    </div>
  );
}