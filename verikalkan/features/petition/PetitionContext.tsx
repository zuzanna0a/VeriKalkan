"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type RightType =
  | "Verilerimi Sil (KVKK Md.7)"
  | "Verilerim Hakkında Bilgi Ver (KVKK Md.11)"
  | "Verilerimi Düzelt (KVKK Md.11)";

export interface PetitionFormData {
  companyName: string;
  dpoEmail: string;
  firstName: string;
  lastName: string;
  email: string;
  tcLast4: string;
  rightType: RightType | "";
  language: "tr" | "en";
}

interface PetitionContextType {
  formData: PetitionFormData | null;
  setFormData: (data: PetitionFormData) => void;
  clearFormData: () => void;
  generatedPetition: string | null;
  setGeneratedPetition: (text: string | null) => void;
}

const PetitionContext = createContext<PetitionContextType | undefined>(undefined);

export function PetitionProvider({ children }: { children: ReactNode }) {
  const [formData, setFormDataState] = useState<PetitionFormData | null>(null);
  const [generatedPetition, setGeneratedPetition] = useState<string | null>(null);

  const setFormData = (data: PetitionFormData) => {
    setFormDataState(data);
    setGeneratedPetition(null); // form değiştiğinde eski dilekçeyi unut
  };

  const clearFormData = () => {
    setFormDataState(null);
    setGeneratedPetition(null);
  };

  return (
    <PetitionContext.Provider value={{ formData, setFormData, clearFormData, generatedPetition, setGeneratedPetition }}>
      {children}
    </PetitionContext.Provider>
  );
}

export function usePetitionContext() {
  const context = useContext(PetitionContext);
  if (context === undefined) {
    throw new Error("usePetitionContext must be used within a PetitionProvider");
  }
  return context;
}
