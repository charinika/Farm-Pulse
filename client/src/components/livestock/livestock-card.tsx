import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LivestockCardProps {
  animal: {
    id: string;
    name: string;
    breed: string;
    age: number;
    type: string;
    gender: string;
    weight: string;
    image?: string; // image is optional
  };
  onViewProfile: () => void;
  onTrackProductivity: () => void;
  onViewProductivity: () => void;
}

export function LivestockCard({
  animal,
  onViewProfile,
  onTrackProductivity,
  onViewProductivity,
}: LivestockCardProps) {
  return (
    <Card className="w-full sm:w-[300px] shadow-md border">
      {animal.image && (
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-40 object-cover rounded-t-md"
        />
      )}
      <CardHeader>
        <CardTitle className="text-lg font-semibold">{animal.name}</CardTitle>
        <p className="text-sm text-gray-500">{animal.type} • {animal.breed}</p>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Age: {animal.age}</p>
        <p>Gender: {animal.gender}</p>
        <p>Weight: {animal.weight} kg</p>

        <div className="flex flex-col gap-2 pt-2">
          <Button variant="default" className="bg-blue-600 hover:bg-blue-700" onClick={onViewProfile}>
            View Profile
          </Button>
          <Button variant="default" className="bg-green-600 hover:bg-green-700" onClick={onTrackProductivity}>
            Track Productivity
          </Button>
          <Button variant="default" className="bg-purple-600 hover:bg-purple-700" onClick={onViewProductivity}>
            View Productivity
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
