'use client';
import { useEffect, useState } from 'react';
import { fetchBalances, type Balances } from '@/lib/balances';

export default function BalanceCard({
  publicKey,
  refreshKey,
}: {
  publicKey: string;
  refreshKey: number;
}) {
  const requestKey = `${publicKey}:${refreshKey}`;
  const [result, setResult] = useState<{
    requestKey: string;
    balances: Balances | null;
    failed: boolean;
  }>({
    requestKey: '',
    balances: null,
    failed: false,
  });
  const loading = result.requestKey !== requestKey;

  useEffect(() => {
    let active = true;

    fetchBalances(publicKey)
      .then((balances) => {
        if (!active) return;
        setResult({ requestKey, balances, failed: false });
      })
      .catch(() => {
        if (!active) return;
        setResult({ requestKey, balances: null, failed: true });
      });

    return () => {
      active = false;
    };
  }, [publicKey, requestKey]);

  if (loading) {
    return (
      <div className="mt-4 grid animate-pulse grid-cols-2 gap-4">
        <div className="h-20 rounded bg-gray-200" />
        <div className="h-20 rounded bg-gray-200" />
      </div>
    );
  }

  if (result.failed) {
    return <p className="mt-4 text-sm text-red-500">Failed to load balances.</p>;
  }

  const balances = result.balances;

  if (balances && !balances.funded) {
    return (
      <p className="mt-4 rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
        This account is not funded yet. Click &quot;Fund with Friendbot&quot; above.
      </p>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4">
      <div className="rounded border border-gray-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">XLM</p>
        <p className="text-2xl font-bold text-gray-900">{balances?.xlm ?? '0.00'}</p>
      </div>
      <div className="rounded border border-gray-200 bg-white p-4">
        <p className="text-xs uppercase tracking-wide text-gray-500">USDC</p>
        <p className="text-2xl font-bold text-gray-900">{balances?.usdc ?? '0.00'}</p>
      </div>
    </div>
  );
}
