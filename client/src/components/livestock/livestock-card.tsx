import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LivestockCardProps {
  animal: {
    id: string;
    name: string;
    species: string;
    breed?: string;
    gender: string;
    status: string;
    photoUrl?: string;
    tagNumber?: string;
    dateOfBirth?: string;
    updatedAt: string;
  };
  onDelete: (id: string) => void;
}

export default function LivestockCard({ animal, onDelete }: LivestockCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "bg-success text-success-foreground";
      case "treatment":
        return "bg-accent text-accent-foreground";
      case "monitoring":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getDefaultImage = (species: string) => {
    const images = {
      cattle: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      sheep: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      goat: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
      pig: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200",
    };
    return images[species as keyof typeof images] || images.cattle;
  };

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birth = new Date(dateOfBirth);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
    const diffMonths = Math.floor((diffTime % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (diffYears > 0) {
      return `${diffYears} year${diffYears > 1 ? 's' : ''}`;
    } else {
      return `${diffMonths} month${diffMonths > 1 ? 's' : ''}`;
    }
  };

  const lastChecked = new Date(animal.updatedAt).toLocaleDateString();

  return (
    <Card className="bg-gray-50 hover-lift">
      <CardContent className="p-4">
        <img
          src={animal.photoUrl || getDefaultImage(animal.species)}
          alt={`${animal.name} - ${animal.species}`}
          className="w-full h-32 object-cover rounded-md mb-3"
        />
        
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900">{animal.name}</h4>
          <Badge className={getStatusColor(animal.status)}>
            {animal.status}
          </Badge>
        </div>
        
        <p className="text-sm text-gray-600 mb-1">
          {animal.breed} • {animal.gender} 
          {animal.dateOfBirth && ` • ${calculateAge(animal.dateOfBirth)}`}
        </p>
        
        <p className="text-xs text-gray-500 mb-3">
          {animal.tagNumber ? `ID: ${animal.tagNumber}` : `ID: ${animal.id.slice(0, 8)}`} • Last checked: {lastChecked}
        </p>
        
        <div className="flex space-x-2">
          <Button size="sm" className="flex-1">
            <Eye className="w-3 h-3 mr-1" />
            View
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={() => onDelete(animal.id)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
