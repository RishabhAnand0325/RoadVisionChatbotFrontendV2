import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TenderDataSheet = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Structured Data Sheet</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Earthwork</TableCell>
              <TableCell>Excavation and filling</TableCell>
              <TableCell>45,000</TableCell>
              <TableCell>Cubic Meters</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bituminous Work</TableCell>
              <TableCell>DBM + BC Surface</TableCell>
              <TableCell>22.7</TableCell>
              <TableCell>Kilometers</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Drainage</TableCell>
              <TableCell>RCC Side Drains</TableCell>
              <TableCell>45.4</TableCell>
              <TableCell>Kilometers</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TenderDataSheet;
