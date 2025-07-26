import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, AlertTriangle, Shield, Activity, Info } from "lucide-react";

export default function DiseaseDiagnosis() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: diseases, isLoading } = useQuery({
    queryKey: ["/api/diseases", searchQuery],
    queryFn: async () => {
      const url = searchQuery 
        ? `/api/diseases?search=${encodeURIComponent(searchQuery)}`
        : "/api/diseases";
      
      const response = await fetch(url, {
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Failed to fetch diseases");
      }
      
      return response.json();
    },
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-accent text-accent-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />;
      case "medium":
        return <Activity className="w-4 h-4" />;
      case "low":
        return <Shield className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="space-y-6">
          <h1 className="text-2xl font-semibold text-gray-900">Disease Diagnosis</h1>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
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
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Disease Diagnosis</h1>
          <p className="text-gray-600 mt-2">
            Search for diseases, symptoms, and treatment information to help diagnose and treat your livestock.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search diseases or symptoms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* AI Diagnosis Disclaimer */}
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800">Important Disclaimer</h3>
                <p className="text-sm text-amber-700 mt-1">
                  This information is for educational purposes only and should not replace professional veterinary diagnosis. 
                  Always consult with a qualified veterinarian for accurate diagnosis and treatment of your animals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disease Information */}
        {diseases && diseases.length > 0 ? (
          <div className="space-y-4">
            {diseases.map((disease: any) => (
              <Card key={disease.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{disease.name}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getSeverityColor(disease.severity)}>
                          {getSeverityIcon(disease.severity)}
                          <span className="ml-1">{disease.severity} Risk</span>
                        </Badge>
                        {disease.contagious && (
                          <Badge variant="destructive">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Contagious
                          </Badge>
                        )}
                        <div className="flex flex-wrap gap-1">
                          {disease.species?.map((spec: string) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="symptoms">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-primary" />
                          Symptoms
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {disease.symptoms?.map((symptom: string, index: number) => (
                            <li key={index} className="text-gray-700">{symptom}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="treatment">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-success" />
                          Treatment
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{disease.treatment}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="prevention">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2 text-secondary" />
                          Prevention
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="prose prose-sm max-w-none">
                          <p className="text-gray-700 whitespace-pre-wrap">{disease.prevention}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    {disease.emergencyProtocol && (
                      <AccordionItem value="emergency">
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
                            Emergency Protocol
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="prose prose-sm max-w-none">
                            <div className="bg-red-50 border border-red-200 rounded-md p-4">
                              <p className="text-red-800 whitespace-pre-wrap">{disease.emergencyProtocol}</p>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    )}
                  </Accordion>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Always consult with a veterinarian for proper diagnosis and treatment.
                      </p>
                      <Button variant="outline" size="sm">
                        Contact Vet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No diseases found</h3>
            <p className="text-gray-500">Try searching with different keywords or symptoms.</p>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔬</div>
            <h3 className="text-lg font-medium mb-2">Disease Database</h3>
            <p className="text-gray-500 mb-4">Search for diseases, symptoms, and treatment information.</p>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Start typing to search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Emergency Contacts</div>
                  <div className="text-sm text-gray-500">Find local veterinarians</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Prevention Guide</div>
                  <div className="text-sm text-gray-500">Learn about disease prevention</div>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-medium">Health Records</div>
                  <div className="text-sm text-gray-500">Record diagnosis and treatment</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
