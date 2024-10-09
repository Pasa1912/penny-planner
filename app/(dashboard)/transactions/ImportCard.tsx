import { useState } from "react";
import { format, parse } from "date-fns";

import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImportTable } from "./ImportTable";
import { convertAmountToMilliUnits } from "@/lib/utils";
import { toast } from "sonner";

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = ["amount", "date", "payee"];

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
};

export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
}: Props): JSX.Element => {
  const headers = data[0];
  const body = data.slice(1);

  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>(
    {}
  );

  const handleTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prevSelectedColumns) => {
      const newSelectedColumns = { ...prevSelectedColumns };
      newSelectedColumns[`column_${columnIndex}`] =
        value !== "skip" ? value : null;

      return newSelectedColumns;
    });
  };

  const progress = Object.values(selectedColumns).filter(
    (column) => column && requiredOptions.includes(column)
  ).length;

  const handleContinue = () => {
    const mappedData = {
      headers: headers.map((_header, index) => {
        return selectedColumns[`column_${index}`] || null;
      }),
      body: body
        .map((row) => {
          const transformedRow = row.map((cell, index) => {
            return selectedColumns[`column_${index}`] ? cell : null;
          });

          return transformedRow.every((item) => item === null)
            ? []
            : transformedRow;
        })
        .filter((row) => row.length > 0),
    };

    try {
      const submitPayload = mappedData.body
        .map((row) =>
          row.reduce((acc, cell, index) => {
            const header = mappedData.headers[index];
            if (header === null) return acc;

            acc[header] = cell;

            return acc;
          }, {} as Record<string, string | null>)
        )
        .map((item) => ({
          ...item,
          amount: convertAmountToMilliUnits(item.amount!),
          date: format(parse(item.date!, dateFormat, new Date()), outputFormat),
        }));

      onSubmit(submitPayload);
    } catch (error) {
      toast.error("Invalid date or amount format");
    }
  };

  return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -mt-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between">
          <CardTitle className="text-xl line-clamp-1">
            Import Transaction
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-2 items-center">
            <Button onClick={onCancel} size="sm" className="w-full lg:w-auto">
              Cancel
            </Button>
            <Button
              disabled={progress < requiredOptions.length}
              size="sm"
              className="w-full lg:w-auto"
              onClick={handleContinue}
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={handleTableHeadSelectChange}
          />
        </CardContent>
      </Card>
    </div>
  );
};
