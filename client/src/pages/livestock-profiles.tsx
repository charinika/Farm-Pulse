import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ViewProfileModal from "@/components/livestock/ViewProfileModal";
import TrackProductivityModal from "@/components/livestock/TrackProductivityModal";
import ViewProductivityModal from "@/components/livestock/ViewProductivityModal";
import AddAnimalModal from "@/components/livestock/add-animal-modal";
import { LivestockCard } from "@/components/livestock/livestock-card";
import { Button } from "@/components/ui/button";

// Types
interface Animal {
  id: number;
  name: string;
  age: number;
  breed: string;
  description: string;
  animalType: string;
  gender: string;
  weight: number;
  image?: string;
}

interface ProductivityEntry {
  animalId: number;
  date: string;
  type: string;
  quantity: number;
  notes?: string;
}

export default function LivestockProfiles() {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [showViewProductivity, setShowViewProductivity] = useState(false);
  const [productivity, setProductivity] = useState<ProductivityEntry[]>([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [filterType, setFilterType] = useState("all");
  const [filterGender, setFilterGender] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("livestock");
    if (stored) setAnimals(JSON.parse(stored));

    const prod = localStorage.getItem("productivity");
    if (prod) setProductivity(JSON.parse(prod));
  }, []);

  const handleAddAnimal = (animal: Animal) => {
    setAnimals((prev) => [...prev, animal]);
  };

  const handleSaveProductivity = (data: { date: string; type: string; quantity: number; notes?: string }) => {
    if (!selectedAnimal) return;
    const newRecord = { animalId: selectedAnimal.id, ...data };
    const updated = [...productivity, newRecord];
    setProductivity(updated);
    localStorage.setItem("productivity", JSON.stringify(updated));
  };
  const handleDeleteAnimal = (id: number) => {
  if (window.confirm("Are you sure you want to delete this animal?")) {
    const updated = animals.filter((a) => a.id !== id);
    setAnimals(updated);
    localStorage.setItem("livestock", JSON.stringify(updated));
  }
};

  const filteredAnimals = animals.filter(
    (a) => (filterType === "all" || a.animalType === filterType) &&
           (filterGender === "all" || a.gender === filterGender)
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Livestock Profiles</h1>
        <div className="flex gap-4 items-center">
          <Select onValueChange={setFilterType}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by Type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Cow">Cow</SelectItem>
              <SelectItem value="Sheep">Sheep</SelectItem>
              <SelectItem value="Goat">Goat</SelectItem>
              <SelectItem value="Buffalo">Buffalo</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select onValueChange={setFilterGender}>
            <SelectTrigger className="w-[150px]"><SelectValue placeholder="Filter by Gender" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Genders</SelectItem>
              <SelectItem value="Male">Male</SelectItem>
              <SelectItem value="Female">Female</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setAddModalOpen(true)}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full"
          >
            <Plus className="mr-2 h-5 w-5" /> Add Animal
          </Button>
        </div>
      </div>

      {filteredAnimals.length === 0 ? (
        <p className="text-gray-500 text-center">No animals match the selected filters.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredAnimals.map((animal) => (
            <LivestockCard
              key={animal.id}
              animal={{
                id: animal.id.toString(),
                name: animal.name,
                breed: animal.breed,
                age: animal.age,
                type: animal.animalType,
                gender: animal.gender,
                weight: animal.weight.toString(),
                image: animal.image,
              }}
              onViewProfile={() => { setSelectedAnimal(animal); setShowProfile(true); }}
              onTrackProductivity={() => { setSelectedAnimal(animal); setShowTrackModal(true); }}
              onViewProductivity={() => { setSelectedAnimal(animal); setShowViewProductivity(true); }}
              onDelete={() => handleDeleteAnimal(animal.id)} // 🚨 New
            />
          ))}
        </div>
      )}

      {selectedAnimal && (
        <>
          <ViewProfileModal open={showProfile} onClose={() => setShowProfile(false)} animal={selectedAnimal} />
          <TrackProductivityModal
            open={showTrackModal}
            onClose={() => setShowTrackModal(false)}
            onSave={handleSaveProductivity}
            animal={{ id: selectedAnimal.id, type: selectedAnimal.animalType }}
          />
          <ViewProductivityModal
            open={showViewProductivity}
            onClose={() => setShowViewProductivity(false)}
            animal={{ id: selectedAnimal.id, name: selectedAnimal.name, type: selectedAnimal.animalType }}
          />
        </>
      )}

      <AddAnimalModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddAnimal={handleAddAnimal}
      />
    </div>
  );
}
