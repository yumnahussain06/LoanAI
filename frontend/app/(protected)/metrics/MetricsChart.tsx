"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MetricsProps {
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1_score: number;
  };
}

export default function MetricsChart({ metrics }: MetricsProps) {
  const data = [
    { name: "Accuracy", value: metrics.accuracy },
    { name: "Precision", value: metrics.precision },
    { name: "Recall", value: metrics.recall },
    { name: "F1 Score", value: metrics.f1_score },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>
    </ResponsiveContainer>
  );
}