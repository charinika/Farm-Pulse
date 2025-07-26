import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, AlertTriangle, Phone, Clock, MapPin, Heart, Activity } from "lucide-react";

const emergencyProtocols = [
  {
    id: "1",
    title: "Birthing Complications",
    category: "obstetric",
    urgency: "high",
    species: ["cattle", "sheep", "goat"],
    symptoms: ["Prolonged labor", "Abnormal presentation", "Retained placenta"],
    steps: [
      "Stay calm and assess the situation",
      "Check if the animal is in active labor for more than 2 hours without progress",
      "Wash hands and arms thoroughly with disinfectant",
      "Gently examine the birth canal to determine fetal position",
      "If abnormal presentation, attempt gentle repositioning",
      "Contact veterinarian immediately if complications persist",
      "Monitor mother and offspring closely after birth"
    ],
    warnings: ["Never force extraction", "Maintain sterile conditions", "Have emergency vet contact ready"],
    immediateActions: ["Call veterinarian", "Prepare clean towels", "Ensure animal is in comfortable position"]
  },
  {
    id: "2",
    title: "Bloat (GDV)",
    category: "digestive",
    urgency: "critical",
    species: ["cattle", "sheep", "goat"],
    symptoms: ["Swollen left side", "Difficulty breathing", "Restlessness", "Drooling"],
    steps: [
      "Remove all feed immediately",
      "Keep animal standing and walking if possible",
      "Do NOT allow animal to lie down",
      "Contact veterinarian IMMEDIATELY - this is life-threatening",
      "If vet is unavailable and animal is critical, emergency trocar may be needed",
      "Monitor vital signs continuously",
      "Prepare for emergency transport if necessary"
    ],
    warnings: ["This is a life-threatening emergency", "Minutes matter", "Do not attempt feeding"],
    immediateActions: ["Call vet NOW", "Remove all feed", "Keep animal moving"]
  },
  {
    id: "3",
    title: "Choking",
    category: "respiratory",
    urgency: "critical",
    species: ["cattle", "sheep", "goat", "pig"],
    symptoms: ["Difficulty swallowing", "Excessive salivation", "Extended neck", "Distress"],
    steps: [
      "Restrain animal safely",
      "Open mouth and look for visible obstruction",
      "If object is visible and reachable, try to remove with fingers or pliers",
      "For cattle: pour vegetable oil down throat to lubricate",
      "Massage throat externally to help dislodge object",
      "Contact veterinarian immediately",
      "Monitor breathing and be prepared for tracheostomy if needed"
    ],
    warnings: ["Do not push object further down", "Be careful not to get bitten", "Have emergency airway tools ready"],
    immediateActions: ["Secure animal", "Check for visible obstruction", "Call veterinarian"]
  },
  {
    id: "4",
    title: "Severe Bleeding",
    category: "trauma",
    urgency: "critical",
    species: ["cattle", "sheep", "goat", "pig"],
    symptoms: ["Active bleeding", "Pale gums", "Weakness", "Rapid heart rate"],
    steps: [
      "Apply direct pressure to wound with clean cloth",
      "Elevate injured area if possible",
      "Use pressure bandage if available",
      "Do not remove foreign objects embedded in wound",
      "Monitor for signs of shock",
      "Transport to veterinary facility immediately",
      "Keep animal warm and calm"
    ],
    warnings: ["Do not use tourniquets unless absolutely necessary", "Monitor for shock", "Keep wound clean"],
    immediateActions: ["Apply pressure", "Control bleeding", "Contact emergency vet"]
  },
  {
    id: "5",
    title: "Heat Stress",
    category: "environmental",
    urgency: "high",
    species: ["cattle", "sheep", "goat", "pig"],
    symptoms: ["Heavy panting", "Drooling", "High body temperature", "Weakness"],
    steps: [
      "Move animal to shade immediately",
      "Provide fresh, cool water",
      "Use fans or spray with cool water (not cold)",
      "Focus cooling on head, neck, and legs",
      "Monitor body temperature",
      "Contact veterinarian if temperature above 104°F",
      "Continue cooling until temperature normalizes"
    ],
    warnings: ["Avoid ice-cold water", "Monitor for shock", "Continue monitoring even after improvement"],
    immediateActions: ["Move to shade", "Provide water", "Begin cooling process"]
  },
  {
    id: "6",
    title: "Poisoning",
    category: "toxicology",
    urgency: "critical",
    species: ["cattle", "sheep", "goat", "pig"],
    symptoms: ["Sudden illness", "Vomiting", "Diarrhea", "Neurological signs", "Difficulty breathing"],
    steps: [
      "Remove animal from source of poison immediately",
      "Identify the poison if possible",
      "Do NOT induce vomiting unless specifically instructed",
      "Contact poison control or veterinarian immediately",
      "If skin contact, wash thoroughly with soap and water",
      "Collect sample of suspected poison for analysis",
      "Monitor vital signs and breathing"
    ],
    warnings: ["Never induce vomiting with corrosive substances", "Wear protective equipment", "Time is critical"],
    immediateActions: ["Remove from source", "Identify poison", "Call poison control/vet"]
  }
];

const emergencyContacts = [
  {
    title: "Emergency Veterinary Services",
    phone: "911 or Local Emergency Vet",
    available: "24/7",
    description: "For life-threatening emergencies"
  },
  {
    title: "Poison Control Center",
    phone: "1-800-222-1222",
    available: "24/7",
    description: "For suspected poisoning cases"
  },
  {
    title: "Local Animal Control",
    phone: "Contact Local Authority",
    available: "Business Hours",
    description: "For animal welfare emergencies"
  }
];

export default function EmergencyProtocols() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");

  const filteredProtocols = emergencyProtocols.filter((protocol) => {
    const matchesSearch = protocol.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         protocol.symptoms.some(symptom => symptom.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || protocol.category === selectedCategory;
    const matchesUrgency = selectedUrgency === "all" || protocol.urgency === selectedUrgency;
    
    return matchesSearch && matchesCategory && matchesUrgency;
  });

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return "bg-destructive text-destructive-foreground";
      case "high":
        return "bg-accent text-accent-foreground";
      case "medium":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-gray-500 text-white";
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case "critical":
        return <AlertTriangle className="w-4 h-4" />;
      case "high":
        return <Activity className="w-4 h-4" />;
      default:
        return <Heart className="w-4 h-4" />;
    }
  };

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Emergency Protocols</h1>
          <p className="text-gray-600 mt-2">
            Quick access to step-by-step emergency procedures for livestock health crises.
          </p>
        </div>

        {/* Emergency Alert */}
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Emergency Reminder</h3>
                <p className="text-sm text-red-700 mt-1">
                  In life-threatening situations, contact your emergency veterinarian immediately. 
                  These protocols are supplementary guidance and do not replace professional veterinary care.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Phone className="w-5 h-5 mr-2 text-destructive" />
              Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <h4 className="font-medium text-gray-900">{contact.title}</h4>
                  <p className="text-lg font-semibold text-destructive mt-1">{contact.phone}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-2">
                    <Clock className="w-4 h-4 mr-1" />
                    {contact.available}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{contact.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search emergencies or symptoms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="obstetric">Obstetric</option>
            <option value="digestive">Digestive</option>
            <option value="respiratory">Respiratory</option>
            <option value="trauma">Trauma</option>
            <option value="environmental">Environmental</option>
            <option value="toxicology">Toxicology</option>
          </select>
          <select
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
          >
            <option value="all">All Urgencies</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>

        {/* Emergency Protocols */}
        {filteredProtocols.length > 0 ? (
          <div className="space-y-4">
            {filteredProtocols.map((protocol) => (
              <Card key={protocol.id} className="hover-lift">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{protocol.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge className={getUrgencyColor(protocol.urgency)}>
                          {getUrgencyIcon(protocol.urgency)}
                          <span className="ml-1">{protocol.urgency}</span>
                        </Badge>
                        <div className="flex flex-wrap gap-1">
                          {protocol.species.map((spec: string) => (
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
                  {/* Immediate Actions */}
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <h4 className="font-medium text-red-800 mb-2">Immediate Actions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {protocol.immediateActions.map((action, index) => (
                        <li key={index} className="text-red-700 text-sm">{action}</li>
                      ))}
                    </ul>
                  </div>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="symptoms">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <Activity className="w-4 h-4 mr-2 text-primary" />
                          Symptoms to Look For
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1">
                          {protocol.symptoms.map((symptom, index) => (
                            <li key={index} className="text-gray-700">{symptom}</li>
                          ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="steps">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-success" />
                          Step-by-Step Protocol
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ol className="list-decimal list-inside space-y-2">
                          {protocol.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="warnings">
                      <AccordionTrigger className="text-left">
                        <div className="flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
                          Important Warnings
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="bg-amber-50 border border-amber-200 rounded-md p-4">
                          <ul className="list-disc list-inside space-y-1">
                            {protocol.warnings.map((warning, index) => (
                              <li key={index} className="text-amber-800">{warning}</li>
                            ))}
                          </ul>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-500">
                        Always contact emergency veterinary services for critical situations.
                      </p>
                      <Button variant="destructive" size="sm">
                        <Phone className="w-4 h-4 mr-2" />
                        Call Emergency Vet
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium mb-2">No protocols found</h3>
            <p className="text-gray-500">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Quick Reference */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Reference Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">When to Call Emergency Vet</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Difficulty breathing or choking</li>
                  <li>• Severe bleeding that won't stop</li>
                  <li>• Signs of bloat or severe abdominal pain</li>
                  <li>• Birthing complications lasting {'>'}2 hours</li>
                  <li>• Suspected poisoning</li>
                  <li>• Loss of consciousness or seizures</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Emergency Kit Essentials</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Clean towels and bandages</li>
                  <li>• Antiseptic solution</li>
                  <li>• Thermometer</li>
                  <li>• Flashlight</li>
                  <li>• Emergency vet contact information</li>
                  <li>• Basic medications as advised by vet</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
