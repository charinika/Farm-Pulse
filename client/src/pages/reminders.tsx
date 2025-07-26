import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ReminderCard from "@/components/reminders/reminder-card";
import { Plus, Pill, Syringe, Calendar, Clock } from "lucide-react";

const medicineReminderSchema = z.object({
  livestockId: z.string().min(1, "Please select an animal"),
  medicineName: z.string().min(1, "Medicine name is required"),
  dosage: z.string().min(1, "Dosage is required"),
  frequency: z.string().min(1, "Frequency is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

const vaccinationReminderSchema = z.object({
  livestockId: z.string().min(1, "Please select an animal"),
  vaccineName: z.string().min(1, "Vaccine name is required"),
  scheduledDate: z.string().min(1, "Scheduled date is required"),
  veterinarian: z.string().optional(),
  batchNumber: z.string().optional(),
  notes: z.string().optional(),
});

export default function Reminders() {
  const { toast } = useToast();
  const [isMedicineModalOpen, setIsMedicineModalOpen] = useState(false);
  const [isVaccinationModalOpen, setIsVaccinationModalOpen] = useState(false);

  const { data: livestock, error: livestockError } = useQuery({
    queryKey: ["/api/livestock"],
  });

  const { data: medicineReminders, isLoading: isLoadingMedicine, error: medicineError } = useQuery({
    queryKey: ["/api/medicine-reminders"],
  });

  const { data: vaccinationReminders, isLoading: isLoadingVaccination, error: vaccinationError } = useQuery({
    queryKey: ["/api/vaccination-reminders"],
  });

  const { data: overdueMedicine } = useQuery({
    queryKey: ["/api/medicine-reminders/overdue"],
  });

  const { data: overdueVaccination } = useQuery({
    queryKey: ["/api/vaccination-reminders/overdue"],
  });

  const medicineForm = useForm<z.infer<typeof medicineReminderSchema>>({
    resolver: zodResolver(medicineReminderSchema),
    defaultValues: {
      livestockId: "",
      medicineName: "",
      dosage: "",
      frequency: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: "",
      notes: "",
    },
  });

  const vaccinationForm = useForm<z.infer<typeof vaccinationReminderSchema>>({
    resolver: zodResolver(vaccinationReminderSchema),
    defaultValues: {
      livestockId: "",
      vaccineName: "",
      scheduledDate: "",
      veterinarian: "",
      batchNumber: "",
      notes: "",
    },
  });

  const createMedicineReminderMutation = useMutation({
    mutationFn: async (data: z.infer<typeof medicineReminderSchema>) => {
      const nextDueDate = new Date(data.startDate);
      await apiRequest("POST", "/api/medicine-reminders", {
        ...data,
        startDate: data.startDate,
        endDate: data.endDate || null,
        nextDueDate: nextDueDate.toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-reminders"] });
      toast({
        title: "Success",
        description: "Medicine reminder created successfully",
      });
      setIsMedicineModalOpen(false);
      medicineForm.reset();
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
        description: error.message || "Failed to create medicine reminder",
        variant: "destructive",
      });
    },
  });

  const createVaccinationReminderMutation = useMutation({
    mutationFn: async (data: z.infer<typeof vaccinationReminderSchema>) => {
      await apiRequest("POST", "/api/vaccination-reminders", {
        ...data,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccination-reminders"] });
      toast({
        title: "Success",
        description: "Vaccination reminder created successfully",
      });
      setIsVaccinationModalOpen(false);
      vaccinationForm.reset();
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
        description: error.message || "Failed to create vaccination reminder",
        variant: "destructive",
      });
    },
  });

  const updateMedicineReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/medicine-reminders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/medicine-reminders/overdue"] });
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder",
        variant: "destructive",
      });
    },
  });

  const updateVaccinationReminderMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PUT", `/api/vaccination-reminders/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vaccination-reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/vaccination-reminders/overdue"] });
      toast({
        title: "Success",
        description: "Reminder updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update reminder",
        variant: "destructive",
      });
    },
  });

  // Handle unauthorized errors
  useEffect(() => {
    const errors = [livestockError, medicineError, vaccinationError].filter(Boolean);
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
  }, [livestockError, medicineError, vaccinationError, toast]);

  const handleMarkComplete = (id: string, type: "medicine" | "vaccination") => {
    if (type === "medicine") {
      updateMedicineReminderMutation.mutate({
        id,
        data: { isCompleted: true },
      });
    } else {
      updateVaccinationReminderMutation.mutate({
        id,
        data: { isCompleted: true },
      });
    }
  };

  const handleReschedule = (id: string, type: "medicine" | "vaccination") => {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    if (newDate) {
      if (type === "medicine") {
        updateMedicineReminderMutation.mutate({
          id,
          data: { nextDueDate: new Date(newDate).toISOString() },
        });
      } else {
        updateVaccinationReminderMutation.mutate({
          id,
          data: { scheduledDate: new Date(newDate).toISOString() },
        });
      }
    }
  };

  const formatRemindersForDisplay = (reminders: any[], type: "medicine" | "vaccination") => {
    return (reminders || []).map((reminder: any) => {
      const animal = (livestock || []).find((a: any) => a.id === reminder.livestockId);
      const dueDate = type === "medicine" ? reminder.nextDueDate : reminder.scheduledDate;
      const isOverdue = new Date(dueDate) < new Date() && !reminder.isCompleted;
      
      return {
        id: reminder.id,
        type,
        title: type === "medicine" ? reminder.medicineName : reminder.vaccineName,
        animalName: animal?.name,
        dueDate,
        isOverdue,
        description: type === "medicine" 
          ? `${reminder.dosage} - ${reminder.frequency}`
          : reminder.veterinarian ? `Vet: ${reminder.veterinarian}` : undefined,
      };
    }).filter((r: any) => !(reminders || []).find((orig: any) => orig.id === r.id)?.isCompleted);
  };

  const medicineDisplayReminders = formatRemindersForDisplay(medicineReminders || [], "medicine");
  const vaccinationDisplayReminders = formatRemindersForDisplay(vaccinationReminders || [], "vaccination");
  const allReminders = [...medicineDisplayReminders, ...vaccinationDisplayReminders]
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (isLoadingMedicine || isLoadingVaccination) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Reminders</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="h-16 bg-gray-200 rounded"></div>
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
          <h1 className="text-2xl font-semibold text-gray-900">Reminders</h1>
          <div className="flex space-x-2">
            <Dialog open={isMedicineModalOpen} onOpenChange={setIsMedicineModalOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Pill className="w-4 h-4 mr-2" />
                  Add Medicine
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Medicine Reminder</DialogTitle>
                </DialogHeader>
                <Form {...medicineForm}>
                  <form onSubmit={medicineForm.handleSubmit((data) => createMedicineReminderMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={medicineForm.control}
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
                                {(livestock || []).map((animal: any) => (
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
                        control={medicineForm.control}
                        name="medicineName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Medicine Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Antibiotics" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={medicineForm.control}
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
                        control={medicineForm.control}
                        name="frequency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Frequency</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select frequency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="daily">Daily</SelectItem>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={medicineForm.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={medicineForm.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date (Optional)</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={medicineForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsMedicineModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createMedicineReminderMutation.isPending}>
                        {createMedicineReminderMutation.isPending ? "Creating..." : "Create Reminder"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>

            <Dialog open={isVaccinationModalOpen} onOpenChange={setIsVaccinationModalOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Syringe className="w-4 h-4 mr-2" />
                  Add Vaccination
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Vaccination Reminder</DialogTitle>
                </DialogHeader>
                <Form {...vaccinationForm}>
                  <form onSubmit={vaccinationForm.handleSubmit((data) => createVaccinationReminderMutation.mutate(data))} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={vaccinationForm.control}
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
                                {(livestock || []).map((animal: any) => (
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
                        control={vaccinationForm.control}
                        name="vaccineName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Vaccine Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Annual Vaccine" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={vaccinationForm.control}
                        name="scheduledDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Scheduled Date</FormLabel>
                            <FormControl>
                              <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={vaccinationForm.control}
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
                        control={vaccinationForm.control}
                        name="batchNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Batch Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Batch #123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={vaccinationForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional notes..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end space-x-3 pt-4">
                      <Button type="button" variant="outline" onClick={() => setIsVaccinationModalOpen(false)}>
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createVaccinationReminderMutation.isPending}>
                        {createVaccinationReminderMutation.isPending ? "Creating..." : "Create Reminder"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All Reminders</TabsTrigger>
            <TabsTrigger value="medicine">Medicine</TabsTrigger>
            <TabsTrigger value="vaccination">Vaccination</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {allReminders.length > 0 ? (
              allReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onMarkComplete={(id) => handleMarkComplete(id, reminder.type)}
                  onReschedule={(id) => handleReschedule(id, reminder.type)}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No reminders scheduled</h3>
                <p className="text-gray-500 mb-4">Create your first reminder to keep track of medicine and vaccinations.</p>
                <div className="flex justify-center space-x-2">
                  <Button onClick={() => setIsMedicineModalOpen(true)}>
                    <Pill className="w-4 h-4 mr-2" />
                    Add Medicine
                  </Button>
                  <Button onClick={() => setIsVaccinationModalOpen(true)}>
                    <Syringe className="w-4 h-4 mr-2" />
                    Add Vaccination
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="medicine" className="space-y-4">
            {medicineDisplayReminders.length > 0 ? (
              medicineDisplayReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onMarkComplete={(id) => handleMarkComplete(id, "medicine")}
                  onReschedule={(id) => handleReschedule(id, "medicine")}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Pill className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No medicine reminders</h3>
                <p className="text-gray-500 mb-4">Add medicine reminders to track treatments and medications.</p>
                <Button onClick={() => setIsMedicineModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Medicine Reminder
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="vaccination" className="space-y-4">
            {vaccinationDisplayReminders.length > 0 ? (
              vaccinationDisplayReminders.map((reminder) => (
                <ReminderCard
                  key={reminder.id}
                  reminder={reminder}
                  onMarkComplete={(id) => handleMarkComplete(id, "vaccination")}
                  onReschedule={(id) => handleReschedule(id, "vaccination")}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Syringe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No vaccination reminders</h3>
                <p className="text-gray-500 mb-4">Schedule vaccination reminders to keep your animals healthy.</p>
                <Button onClick={() => setIsVaccinationModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Vaccination Reminder
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
