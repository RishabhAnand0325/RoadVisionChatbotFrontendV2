import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const TenderOnePager = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Tender Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tender Reference</p>
              <p className="text-lg font-semibold">PWD/NH-44/2024/ROAD/001</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estimated Value</p>
              <p className="text-lg font-semibold text-green-600">₹15.5 Cr</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Authority</p>
              <p className="text-lg font-semibold">Public Works Department, Karnataka</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Submission Deadline</p>
              <p className="text-lg font-semibold">25 Apr 2024</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            Construction and maintenance of 4-lane highway on NH-44 section from Km 125.5 to Km 148.3, 
            including upgrading existing 2-lane road, construction of service roads, drainage systems, 
            and installation of safety measures.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Key Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">1</Badge>
              <span>Minimum experience of 7 years in highway construction</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">2</Badge>
              <span>Similar works worth ₹10 Cr+ completed in last 5 years</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">3</Badge>
              <span>Valid contractor license and tax registrations</span>
            </li>
            <li className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">4</Badge>
              <span>EMD of ₹31 Lakhs required</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderOnePager;
