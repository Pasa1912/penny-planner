import { useCallback, useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { AreaChart, BarChart3, FileSearch, LineChart } from "lucide-react";
import { AreaVariant } from "@/components/AreaVariant";
import { BarVariant } from "@/components/BarVariant";
import { LineVariant } from "@/components/LineVariant";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

type Props = {
  data?: {
    date: string;
    income: number;
    expenses: number;
  }[];
};

enum ChartType {
  AREA = "area",
  BAR = "bar",
  LINE = "lines",
}

const chartOptions = [
  { value: ChartType.AREA, Icon: AreaChart, label: "Area Chart" },
  { value: ChartType.BAR, Icon: BarChart3, label: "Bar Chart" },
  { value: ChartType.LINE, Icon: LineChart, label: "Line Chart" },
];

export const ChartTombstone = () => {
  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader
        className="flex space-y-2 lg:space-y-0 lg:flex-row
    lg:items-center justify-between"
      >
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      </CardHeader>
      <CardContent>
        <div className="h-[350px] w-full flex items-center justify-center">
          <Loader2 className="h-6 w-6 text-slate-300 animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
};

const BaseChart = ({
  type,
  data,
}: {
  type: ChartType;
  data: {
    date: string;
    income: number;
    expenses: number;
  }[];
}) => {
  switch (type) {
    case ChartType.AREA:
      return <AreaVariant data={data} />;
    case ChartType.BAR:
      return <BarVariant data={data} />;
    case ChartType.LINE:
      return <LineVariant data={data} />;
  }
};

export const Chart = ({ data = [] }: Props) => {
  const [chartType, setChartType] = useState<ChartType>(ChartType.AREA);

  const onTypeChange = useCallback((type: ChartType) => setChartType(type), []);

  return (
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">Transactions</CardTitle>
        <Select defaultValue={chartType} onValueChange={onTypeChange}>
          <SelectTrigger className="lg:w-auto h-9 rounded-md px-3">
            <SelectValue placeholder="Chart type" />
          </SelectTrigger>
          <SelectContent>
            {chartOptions.map(({ value, label, Icon }) => (
              <SelectItem key={value} value={value}>
                <div className="flex items-center">
                  <Icon className="size-4 mr-2 shrink-0" />
                  <p className="line-clamp-1">{label}</p>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col gap-y-4 items-center justify-center h-[350px] w-full">
            <FileSearch className="size-6 text-muted-foreground" />
            <p className="text-muted-foreground text-sm">
              No data for selected period
            </p>
          </div>
        ) : (
          <BaseChart type={chartType} data={data} />
        )}
      </CardContent>
    </Card>
  );
};
