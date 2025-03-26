"use client";

import { useEffect, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../lib/ui/card";
import Chart from "chart.js/auto";

export function BarChart({ title, description, data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "bar",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: data.label,
              data: data.values,
              backgroundColor: [
                "rgba(59, 130, 246, 0.7)", // blue
                "rgba(16, 185, 129, 0.7)", // green
                "rgba(168, 85, 247, 0.7)", // purple
                "rgba(249, 115, 22, 0.7)", // orange
                "rgba(239, 68, 68, 0.7)", // red
                "rgba(20, 184, 166, 0.7)", // teal
              ],
              borderColor: [
                "rgba(59, 130, 246, 1)",
                "rgba(16, 185, 129, 1)",
                "rgba(168, 85, 247, 1)",
                "rgba(249, 115, 22, 1)",
                "rgba(239, 68, 68, 1)",
                "rgba(20, 184, 166, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}

export function DoughnutChart({ title, description, data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy existing chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      chartInstance.current = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: data.labels,
          datasets: [
            {
              label: data.label,
              data: data.values,
              backgroundColor: [
                "rgba(16, 185, 129, 0.7)", // green - Approved
                "rgba(245, 158, 11, 0.7)", // amber - Pending
                "rgba(59, 130, 246, 0.7)", // blue - In Review
                "rgba(239, 68, 68, 0.7)", // red - Rejected
              ],
              borderColor: [
                "rgba(16, 185, 129, 1)",
                "rgba(245, 158, 11, 1)",
                "rgba(59, 130, 246, 1)",
                "rgba(239, 68, 68, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "right",
            },
          },
        },
      });
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <canvas ref={chartRef} className="w-full h-full"></canvas>
        </div>
      </CardContent>
    </Card>
  );
}
