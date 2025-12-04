import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const TenderScopeOfWork = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Scope of Work Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Road Construction</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Earthwork excavation and filling - 45,000 cubic meters</li>
              <li>Granular sub-base course - 22.7 km length</li>
              <li>Dense bituminous macadam - 22.7 km</li>
              <li>Bituminous concrete surface - 22.7 km</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">2. Drainage Works</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Construction of RCC side drains - 45.4 km</li>
              <li>Cross drainage structures - 12 locations</li>
              <li>Pipe culverts installation</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">3. Safety Measures</h3>
            <ul className="list-disc list-inside text-sm space-y-1 ml-4">
              <li>Road marking and signage</li>
              <li>Guard rails installation - critical sections</li>
              <li>Crash barriers at bridges</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenderScopeOfWork;
