import { PetitionProvider } from "@/features/petition/PetitionContext";

export default function DilekceLayout({ children }: { children: React.ReactNode }) {
  return <PetitionProvider>{children}</PetitionProvider>;
}
