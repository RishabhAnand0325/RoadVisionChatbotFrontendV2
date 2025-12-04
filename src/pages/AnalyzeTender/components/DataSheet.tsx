import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DataSheetData } from '@/lib/types/analyze.type';

interface DataSheetProps {
  dataSheet: DataSheetData | null;
}

export default function DataSheet({ dataSheet }: DataSheetProps) {
  if (!dataSheet) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Data Sheet information is not available yet.</p>
      </div>
    );
  }
  const renderTable = (title: string, data: any[]) => {
    if (!data || data.length === 0) return null;

    return (
      <div className="space-y-3">
        <h4 className="font-semibold">{title}</h4>
        <div className="overflow-x-auto border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="font-semibold">Item</TableHead>
                <TableHead className="font-semibold">Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item, idx) => (
                <TableRow key={idx} className={item.highlight ? 'bg-blue-50' : ''}>
                  <TableCell className="font-medium">{item.label}</TableCell>
                  <TableCell className={item.highlight ? 'font-semibold text-blue-700' : ''}>
                    {item.value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Project Information */}
      <Card className="p-6">
        {renderTable('Project Information', dataSheet.project_information)}
      </Card>

      {/* Contract Details */}
      <Card className="p-6">
        {renderTable('Contract Details', dataSheet.contract_details)}
      </Card>

      {/* Financial Details */}
      <Card className="p-6">
        {renderTable('Financial Details', dataSheet.financial_details)}
      </Card>

      {/* Technical Summary */}
      <Card className="p-6">
        {renderTable('Technical Summary', dataSheet.technical_summary)}
      </Card>

      {/* Important Dates */}
      <Card className="p-6">
        {renderTable('Important Dates', dataSheet.important_dates)}
      </Card>
    </div>
  );
}
