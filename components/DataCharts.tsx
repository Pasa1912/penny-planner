"use client";

import { Chart, ChartTombstone } from "@/components/Chart";
import { Pie, PieTombstone } from "@/components/Pie";
import { useGetSummary } from "@/features/summary/api/useGetSummary";

export const DataCharts = () => {
  const { data, isLoading } = useGetSummary();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
        <div className="col-span-1 lg:col-span-3 xl:col-span-4">
          <ChartTombstone />
        </div>
        <div className="col-span-1 lg:col-span-3 xl:col-span-2">
          <PieTombstone />
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={data?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <Pie data={data?.categories} />
      </div>
    </div>
  );
};
