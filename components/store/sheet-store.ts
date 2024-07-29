import { create } from "zustand";

interface StateType {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

const useSheetStore = create<StateType>((set) => ({
	isOpen: false,
	onOpen: () => set((state) => ({ isOpen: !state.isOpen })),
	onClose: () => set({ isOpen: false }),
}));

export default useSheetStore;
