import { Phone, AlertTriangle } from "lucide-react";

export default function EmergencyProtocols() {
  const hospitals = [
    {
      name: "Madras Veterinary College Hospital, Chennai (TANUVAS)",
      desc: "Leading veterinary teaching hospital under TANUVAS. Handles small & large animal emergencies.",
      phone: "+91 44 2536 2231",
      availability: "24/7 Emergency Ward",
    },
    {
      name: "District Veterinary Hospital, Coimbatore",
      desc: "Major government veterinary hospital serving western Tamil Nadu.",
      phone: "+91 422 230 0497",
      availability: "Working hours",
    },
    {
      name: "District Veterinary Hospital, Madurai",
      desc: "Handles cattle, goat, and pet emergencies for the southern region.",
      phone: "+91 452 253 0620",
      availability: "Working hours",
    },
    {
      name: "District Veterinary Hospital, Tirunelveli",
      desc: "Regional veterinary hospital for Tirunelveli and nearby districts.",
      phone: "+91 462 256 0270",
      availability: "Working hours",
    },
  ];

  const firstAid = [
    {
      title: "🐍 Snake Bite",
      steps: [
        "Keep the animal calm and restrict movement.",
        "Do NOT attempt to suck venom or cut the wound.",
        "Tie a cloth above the bite loosely (not tight like a tourniquet).",
        "Rush to the nearest vet hospital immediately.",
      ],
    },
    {
      title: "🩸 Bleeding / Injury",
      steps: [
        "Apply clean cloth or sterile gauze with firm pressure.",
        "Do not use cotton directly on open wounds.",
        "If bleeding is severe, keep animal still until help arrives.",
      ],
    },
    {
      title: "🦴 Fracture / Broken Bone",
      steps: [
        "Avoid moving the animal unnecessarily.",
        "If possible, immobilize the limb with a wooden stick & bandage.",
        "Transport carefully to hospital without twisting the injured part.",
      ],
    },
    {
      title: "☠️ Poisoning / Suspected Toxin",
      steps: [
        "Do not induce vomiting unless advised by vet.",
        "Remove access to the poison source (plants, chemicals, feed).",
        "Call vet and describe what was eaten or exposure details.",
      ],
    },
    {
      title: "😮 Choking / Blocked Throat",
      steps: [
        "Check if object is visible and remove with hand if safe.",
        "If breathing is difficult, keep animal’s head low.",
        "Do not push object further — rush to hospital immediately.",
      ],
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🚨 Emergency Protocols</h1>
      <p className="text-gray-600 mb-6">
        Quick, verified helplines and first-aid steps for livestock and companion animal emergencies in Tamil Nadu. 
        Numbers last verified: <b>Aug 2025</b>. If a line is busy, try the next option or contact the nearest hospital.
      </p>

      {/* Ambulance Section */}
      <h2 className="text-xl font-semibold border-b pb-2 mb-4">🚑 Ambulance</h2>
      <div className="bg-white rounded-xl shadow p-4 mb-6 flex flex-col justify-between min-h-[140px]">
        <div>
          <h3 className="font-semibold">Animal Mobile Medical Ambulance (AMMA) — Tamil Nadu</h3>
          <p className="text-gray-600 text-sm">
            State-run mobile veterinary ambulance service for pets and livestock emergencies across Tamil Nadu.
          </p>
          <p className="text-sm text-green-600 mt-1">Availability: 24/7</p>
        </div>
        <button className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg w-fit">
          <Phone size={18} /> 1962
        </button>
      </div>

      {/* Hospitals Section */}
      <h2 className="text-xl font-semibold border-b pb-2 mb-4">🏥 Veterinary Hospitals</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {hospitals.map((h, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow p-4 flex flex-col justify-between min-h-[160px]"
          >
            <div>
              <h3 className="font-semibold">{h.name}</h3>
              <p className="text-gray-600 text-sm">{h.desc}</p>
              <p className="text-sm text-green-600 mt-1">Availability: {h.availability}</p>
            </div>
            <button className="mt-3 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg w-fit">
              <Phone size={18} /> {h.phone}
            </button>
          </div>
        ))}
      </div>

      {/* First Aid Section */}
      <h2 className="text-xl font-semibold border-b pb-2 mb-4 flex items-center gap-2">
        <AlertTriangle className="text-yellow-600" size={22} /> First Aid Quick Steps
      </h2>
      <div className="space-y-4">
        {firstAid.map((item, idx) => (
          <div key={idx} className="bg-yellow-50 border-l-4 border-yellow-600 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-2">{item.title}</h3>
            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
              {item.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
