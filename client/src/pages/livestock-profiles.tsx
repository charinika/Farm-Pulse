import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LivestockCard from "@/components/livestock/livestock-card";
import AddAnimalModal from "@/components/livestock/add-animal-modal";
import { Plus, Search } from "lucide-react";

export default function LivestockProfiles() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { data: livestock, isLoading } = useQuery({
    queryKey: ["/api/livestock"],
  });

  const safeLivestock = livestock || [];

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/livestock/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/livestock"] });
      toast({
        title: "Success",
        description: "Animal deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete animal",
        variant: "destructive",
      });
    },
  });

  const filteredLivestock = safeLivestock.filter((animal: any) => {
    const matchesSearch = animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         animal.tagNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = speciesFilter === "all" || animal.species === speciesFilter;
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter;
    
    return matchesSearch && matchesSpecies && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this animal?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Livestock Profiles</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-4 animate-pulse">
                <div className="w-full h-32 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Livestock Profiles</h1>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add New Animal
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search animals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Species" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Species</SelectItem>
              <SelectItem value="cattle">Cattle</SelectItem>
              <SelectItem value="sheep">Sheep</SelectItem>
              <SelectItem value="goat">Goat</SelectItem>
              <SelectItem value="pig">Pig</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="healthy">Healthy</SelectItem>
              <SelectItem value="treatment">Treatment</SelectItem>
              <SelectItem value="monitoring">Monitoring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Animal Cards Grid */}
        {filteredLivestock.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLivestock.map((animal: any) => (
              <LivestockCard
                key={animal.id}
                animal={animal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {livestock?.length === 0 ? (
                <>
                  <div className="text-6xl mb-4">🐄</div>
                  <h3 className="text-lg font-medium mb-2">No animals yet</h3>
                  <p className="mb-4">Start by adding your first animal to the farm.</p>
                  <Button onClick={() => setIsAddModalOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Animal
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">🔍</div>
                  <h3 className="text-lg font-medium mb-2">No animals found</h3>
                  <p>Try adjusting your search or filters.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Animal Modal */}
      <AddAnimalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </main>
  );
}
