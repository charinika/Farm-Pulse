import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FileText, Plus, Calendar, DollarSign, User, Pill } from "lucide-react";

const healthRecordSchema = z.object({
  livestockId: z.string().min(1, "Please select an animal"),
  recordType: z.string().min(1, "Please select record type"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  veterinarian: z.string().optional(),
  medication: z.string().optional(),
  dosage: z.string().optional(),
  cost: z.string().optional(),
  recordDate: z.string().min(1, "Record date is required"),
  followUpDate: z.string().optional(),
});

export default function HealthRecords() {
  const { toast } = useToast();
  const [selectedAnimal, setSelectedAnimal] = useState<string>("all");
  const [recordTypeFilter, setRecordTypeFilter] = useState<string>("all");
  const [isAddRecordOpen, setIsAddRecordOpen] = useState(false);

  const { data: livestock, error: livestockError } = useQuery({
    queryKey: ["/api/livestock"],
  });

  const { data: healthRecords, isLoading, error: recordsError } = useQuery({
    queryKey: ["/api/health-records", selectedAnimal],
    queryFn: async () => {
      if (selectedAnimal === "all") {
        // Get all records for all animals
        const allRecords = [];
        for (const animal of (livestock || [])) {
          const response = await fetch(`/api/livestock/${animal.id}/health-records`, {
            credentials: "include",
          });
          if (response.ok) {
            const records = await response.json();
            allRecords.push(...records.map((record: any) => ({ ...record, animalName: animal.name })));
          }
        }
        return allRecords.sort((a, b) => new Date(b.recordDate).getTime() - new Date(a.recordDate).getTime());
      } else {
        const response = await fetch(`/api/livestock/${selectedAnimal}/health-records`, {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch health records");
        const records = await response.json();
        const animal = (livestock || []).find((a: any) => a.id === selectedAnimal);
        return records.map((record: any) => ({ ...record, animalName: animal?.name }));
      }
    },
    enabled: !!livestock,
  });

  const form = useForm<z.infer<typeof healthRecordSchema>>({
    resolver: zodResolver(healthRecordSchema),
    defaultValues: {
      livestockId: "",
      recordType: "",
      title: "",
      description: "",
      veterinarian: "",
      medication: "",
      dosage: "",
      cost: "",
      recordDate: new Date().toISOString().split('T')[0],
      followUpDate: "",
    },
  });

  const createRecordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof healthRecordSchema>) => {
      await apiRequest("POST", "/api/health-records", {
        ...data,
        recordDate: new Date(data.recordDate).toISOString(),
        followUpDate: data.followUpDate ? new Date(data.followUpDate).toISOString() : undefined,
        cost: data.cost ? parseFloat(data.cost) : undefined,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/health-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/metrics"] });
      queryClient.invalidateQueries({ queryKey: ["/api/activity-logs"] });
      toast({
        title: "Success",
        description: "Health record added successfully",
      });
      setIsAddRecordOpen(false);
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: error.message || "Failed to add health record",
        variant: "destructive",
      });
    },
  });

  // Handle unauthorized errors
  useEffect(() => {
    const errors = [livestockError, recordsError].filter(Boolean);
    for (const error of errors) {
      if (error && isUnauthorizedError(error as Error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    }
  }, [livestockError, recordsError, toast]);

  const filteredRecords = healthRecords?.filter((record: any) => {
    const matchesType = recordTypeFilter === "all" || record.recordType === recordTypeFilter;
    return matchesType;
  }) || [];

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "vaccination":
        return <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center"><FileText className="w-4 h-4 text-white" /></div>;
      case "treatment":
        return <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"><Pill className="w-4 h-4 text-white" /></div>;
      case "checkup":
        return <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center"><User className="w-4 h-4 text-white" /></div>;
      default:
        return <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"><FileText className="w-4 h-4 text-white" /></div>;
    }
  };

  const getRecordTypeBadge = (type: string) => {
    switch (type) {
      case "vaccination":
        return <Badge className="bg-secondary text-secondary-foreground">Vaccination</Badge>;
      case "treatment":
        return <Badge className="bg-accent text-accent-foreground">Treatment</Badge>;
      case "checkup":
        return <Badge className="bg-success text-success-foreground">Checkup</Badge>;
      case "diagnosis":
        return <Badge className="bg-destructive text-destructive-foreground">Diagnosis</Badge>;
      default:
        return <Badge>{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Health Records</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
          <h1 className="text-2xl font-semibold text-gray-900">Health Records</h1>
          <Dialog open={isAddRecordOpen} onOpenChange={setIsAddRecordOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Health Record
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add Health Record</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => createRecordMutation.mutate(data))} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="livestockId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Animal</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select animal" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {livestock?.map((animal: any) => (
                                <SelectItem key={animal.id} value={animal.id}>
                                  {animal.name} ({animal.species})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recordType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Record Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="vaccination">Vaccination</SelectItem>
                              <SelectItem value="treatment">Treatment</SelectItem>
                              <SelectItem value="checkup">Checkup</SelectItem>
                              <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Annual vaccination" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="veterinarian"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Veterinarian</FormLabel>
                          <FormControl>
                            <Input placeholder="Dr. Smith" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="medication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medication</FormLabel>
                          <FormControl>
                            <Input placeholder="Medicine name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10ml" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost ($)</FormLabel>
                          <FormControl>
                            <Input type="number" step="0.01" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="recordDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Record Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="followUpDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Follow-up Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Additional notes..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsAddRecordOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createRecordMutation.isPending}>
                      {createRecordMutation.isPending ? "Adding..." : "Add Record"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedAnimal} onValueChange={setSelectedAnimal}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="All Animals" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Animals</SelectItem>
              {livestock?.map((animal: any) => (
                <SelectItem key={animal.id} value={animal.id}>
                  {animal.name} ({animal.species})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={recordTypeFilter} onValueChange={setRecordTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="vaccination">Vaccination</SelectItem>
              <SelectItem value="treatment">Treatment</SelectItem>
              <SelectItem value="checkup">Checkup</SelectItem>
              <SelectItem value="diagnosis">Diagnosis</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Health Records Timeline */}
        {filteredRecords.length > 0 ? (
          <div className="space-y-4">
            {filteredRecords.map((record: any) => (
              <Card key={record.id} className="hover-lift">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getRecordTypeIcon(record.recordType)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{record.title}</h3>
                          <p className="text-sm text-gray-600">{record.animalName}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getRecordTypeBadge(record.recordType)}
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(record.recordDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      
                      {record.description && (
                        <p className="text-gray-700 mb-3">{record.description}</p>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        {record.veterinarian && (
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">Dr. {record.veterinarian}</span>
                          </div>
                        )}
                        {record.medication && (
                          <div className="flex items-center">
                            <Pill className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-gray-600">{record.medication}</span>
                          </div>
                        )}
                        {record.dosage && (
                          <div className="text-gray-600">
                            Dosage: {record.dosage}
                          </div>
                        )}
                        {record.cost && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                            <span className="text-gray-600">${record.cost}</span>
                          </div>
                        )}
                      </div>
                      
                      {record.followUpDate && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            Follow-up scheduled: {new Date(record.followUpDate).toLocaleDateString()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No health records found</h3>
              <p className="mb-4">Start by adding the first health record for your animals.</p>
              <Button onClick={() => setIsAddRecordOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add First Record
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
