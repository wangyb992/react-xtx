import { create } from 'zustand';
import { getCategoryAPI } from '@/api/layout'; 

export const useCategoryStore = create((set) => ({
  categoryList: [],
  getCategory: async () => {
    const res = await getCategoryAPI();
    set({ categoryList: res.data.result });
  }
}));