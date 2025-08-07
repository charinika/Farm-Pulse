// src/components/livestock/ViewProfileModal.tsx

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Animal = {
  id: number;
  name: string;
  age: number;
  breed: string;
  animalType: string;    // was `type`
  gender: string;
  weight: number;
  description: string;
  image?: string;        // matches livestock-profile’s `image`
};

interface ViewProfileModalProps {
  animal: Animal;
  open: boolean;
  onClose: () => void;
}

export default function ViewProfileModal({ animal, open, onClose }: ViewProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {animal.name}'s Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {animal.image && (
            <img
              src={animal.image}
              alt={animal.name}
              className="w-full h-48 object-cover rounded"
            />
          )}
          <p><strong>Type:</strong> {animal.animalType}</p>
          <p><strong>Breed:</strong> {animal.breed}</p>
          <p><strong>Age:</strong> {animal.age} years</p>
          <p><strong>Gender:</strong> {animal.gender}</p>
          <p><strong>Weight:</strong> {animal.weight} kg</p>
          <p><strong>Description:</strong></p>
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{animal.description}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
