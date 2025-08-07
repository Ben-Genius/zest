import { create } from "zustand";
import { getClassProfile } from "../services/classService";
import { Strand } from "../types";

interface ClassProfileState {
  classProfile: Strand[];
  loading: boolean;
  error: string | null;
  fetchClassProfile: () => Promise<void>;
}

export const useClassStore = create<ClassProfileState>((set) => ({
  classProfile: [],
  loading: false,
  error: null,
  fetchClassProfile: async () => {
    set({ loading: true, error: null });
    try {
      const data = await getClassProfile(); // returns { strands: Strand[] }
      set({ classProfile: data.strands, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
