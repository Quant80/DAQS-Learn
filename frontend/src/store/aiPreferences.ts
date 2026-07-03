import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIProvider } from "@/lib/aiProvider";
import { DEFAULT_MODEL_ID } from "@/lib/aiProvider";

interface AIPreferencesStore {
  provider: AIProvider;
  modelId: string;
  setModel(provider: AIProvider, modelId: string): void;
}

export const useAIPreferences = create<AIPreferencesStore>()(
  persist(
    (set) => ({
      provider: "claude",
      modelId: DEFAULT_MODEL_ID,
      setModel(provider, modelId) {
        set({ provider, modelId });
      },
    }),
    { name: "daqs-ai-preferences" }
  )
);
