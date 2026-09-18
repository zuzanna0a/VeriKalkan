"use client";
import { createContext, useContext, useState } from "react";

interface PetitionContextType {
  petitionText: string;
  setPetitionText: (text: string) => void;
}

const PetitionContext = createContext<PetitionContextType>({
  petitionText: "",
  setPetitionText: () => {},
});

export function PetitionProvider({ children }: { children: React.ReactNode }) {
  const [petitionText, setPetitionText] = useState("");
  return (
    <PetitionContext.Provider value={{ petitionText, setPetitionText }}>
      {children}
    </PetitionContext.Provider>
  );
}

export const usePetition = () => useContext(PetitionContext);
