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
  onDelete: () => void;   // ✅ NEW
}

export function LivestockCard({
  animal,
  onViewProfile,
  onTrackProductivity,
  onViewProductivity,
  onDelete,   // ✅ NEW
}: LivestockCardProps) {
  return (
    <Card className="w-full max-w-[600px] shadow-lg border-stone-200 bg-white rounded-xl transition-all duration-300 hover:shadow-xl flex flex-col">
      {animal.image && (
        <img
          src={animal.image}
          alt={animal.name}
          className="w-full h-48 object-cover object-center rounded-t-xl"
        />
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold text-stone-800">{animal.name}</CardTitle>
        <p className="text-sm text-stone-600">{animal.type} • {animal.breed}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-stone-700">Age: {animal.age}</p>
        <p className="text-stone-700">Gender: {animal.gender}</p>
        <p className="text-stone-700">Weight: {animal.weight} kg</p>

        <div className="flex flex-col gap-2 pt-2">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            onClick={onViewProfile}
          >
            View Profile
          </Button>
          <Button
            variant="default"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            onClick={onTrackProductivity}
          >
            Track Productivity
          </Button>
          <Button
            variant="default"
            className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            onClick={onViewProductivity}
          >
            View Productivity
          </Button>
          <Button
            variant="destructive"
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300"
            onClick={onDelete}
          >
            Delete Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  )};