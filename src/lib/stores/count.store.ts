import { createStore } from '$lib/utils/create-store.util';

export const {
	store: countStore,
	dispatchReducers: { add, subtract, set }
} = createStore({
	initialState: { value: 1 },
	reducers: {
		add: (state, payload: number) => {
			state.value += payload;
		},
		subtract: (state, payload: number) => {
			state.value -= payload;
		},
		set(state, payload: string) {
			state.value = Number(payload);
		}
	}
});
