import { useState, useRef, ChangeEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AddAnimalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnimal: (animal: any) => void;
}

export default function AddAnimalModal({ isOpen, onClose, onAddAnimal }: AddAnimalModalProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [breed, setBreed] = useState("");
  const [animalType, setAnimalType] = useState("");
  const [gender, setGender] = useState("");
  const [weight, setWeight] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form whenever modal opens
  useEffect(() => {
    if (isOpen) resetForm();
  }, [isOpen]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!age.trim() || isNaN(Number(age))) newErrors.age = "Valid age is required";
    if (!breed.trim()) newErrors.breed = "Breed is required";
    if (!animalType.trim()) newErrors.animalType = "Animal type is required";
    if (!gender.trim()) newErrors.gender = "Gender is required";
    if (!weight.trim() || isNaN(Number(weight))) newErrors.weight = "Valid weight is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!image) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setSubmitted(true);
    if (!validateForm()) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      const newAnimal = {
        id: Date.now(),
        name,
        age: Number(age),
        breed,
        animalType,
        gender,
        weight: Number(weight),
        description,
        image: base64Image,
      };

      // Save to localStorage
      const stored = localStorage.getItem("livestock");
      const list = stored ? JSON.parse(stored) : [];
      localStorage.setItem("livestock", JSON.stringify([...list, newAnimal]));

      // Notify parent
      onAddAnimal(newAnimal);

      resetForm();
      onClose();
    };

    if (image) reader.readAsDataURL(image);
  };

  const resetForm = () => {
    setName("");
    setAge("");
    setBreed("");
    setAnimalType("");
    setGender("");
    setWeight("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setErrors({});
    setSubmitted(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          resetForm();
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-md max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>Add New Animal</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
            {submitted && errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>

          <div>
            <Label>Age</Label>
            <Input value={age} onChange={(e) => setAge(e.target.value)} />
            {submitted && errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
          </div>

          <div>
            <Label>Breed</Label>
            <Input value={breed} onChange={(e) => setBreed(e.target.value)} />
            {submitted && errors.breed && <p className="text-red-500 text-sm">{errors.breed}</p>}
          </div>

          <div>
            <Label>Animal Type</Label>
            <Select onValueChange={setAnimalType}>
              <SelectTrigger>
                <SelectValue placeholder="Select animal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Cow">Cow</SelectItem>
                <SelectItem value="Buffalo">Buffalo</SelectItem>
                <SelectItem value="Goat">Goat</SelectItem>
                <SelectItem value="Sheep">Sheep</SelectItem>
                <SelectItem value="Chicken">Chicken</SelectItem>
                <SelectItem value="Pig">Pig</SelectItem>
              </SelectContent>
            </Select>
            {submitted && errors.animalType && <p className="text-red-500 text-sm">{errors.animalType}</p>}
          </div>

          <div>
            <Label>Gender</Label>
            <Select onValueChange={setGender}>
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
            {submitted && errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div>
            <Label>Weight (kg)</Label>
            <Input value={weight} onChange={(e) => setWeight(e.target.value)} />
            {submitted && errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
          </div>

          <div>
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
            {submitted && errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
          </div>

          <div>
            <Label>Image</Label>
            <Input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />
            {submitted && errors.image && <p className="text-red-500 text-sm">{errors.image}</p>}
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-full h-40 object-cover rounded"
              />
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button onClick={handleSubmit}>Add Animal</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
