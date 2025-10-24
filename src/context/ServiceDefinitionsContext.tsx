import React, { createContext, useContext, useState } from "react";

export interface ServiceDefinition {
  name: string;
  enabled: boolean;
}

interface ServiceDefinitionsContextType {
  services: ServiceDefinition[];
  toggleService: (name: string) => void;
}

const ServiceDefinitionsContext = createContext<ServiceDefinitionsContextType | undefined>(undefined);

export function ServiceDefinitionsProvider({ children }: { children: React.ReactNode }) {
  const [services, setServices] = useState<ServiceDefinition[]>([
    { name: "VertexTreeMap", enabled: true },
    { name: "MemoryCounter", enabled: true },
  ]);

  const toggleService = (name: string) => {
    setServices((prev) =>
      prev.map((service) =>
        service.name === name ? { ...service, enabled: !service.enabled } : service
      )
    );
  };

  return (
    <ServiceDefinitionsContext.Provider value={{ services, toggleService }}>
      {children}
    </ServiceDefinitionsContext.Provider>
  );
}

export function useServiceDefinitions() {
  const context = useContext(ServiceDefinitionsContext);
  if (!context) {
    throw new Error("useServiceDefinitions must be used within ServiceDefinitionsProvider");
  }
  return context;
}

