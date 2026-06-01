"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MetricsChart from "./MetricsChart";

export default function MetricsPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    setAllowed(true);

    const fetchMetrics = async () => {
      const res = await fetch("http://127.0.0.1:8000/metrics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMetrics(data);
      }
    };

    fetchMetrics();
  }, []);

  if (!allowed || !metrics) {
    return <p className="p-10">Checking authentication...</p>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">
        Model Performance Metrics
      </h1>

      <div className="mb-8">
        <p>Accuracy: {metrics.accuracy}</p>
        <p>Precision: {metrics.precision}</p>
        <p>Recall: {metrics.recall}</p>
        <p>F1 Score: {metrics.f1_score}</p>
      </div>

      <MetricsChart metrics={metrics} />
    </div>
  );
}