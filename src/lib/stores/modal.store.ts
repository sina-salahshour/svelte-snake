import { createStore } from '$lib/utils/create-store.util';
import type { ComponentType, SvelteComponentTyped } from 'svelte';

export const {
	store: modalStore,
	dispatchReducers: { hideModal, showModal }
} = createStore({
	initialState: { isVisible: false, component: null as ComponentType<SvelteComponentTyped> | null },
	reducers: {
		showModal(state, component: ComponentType<SvelteComponentTyped>) {
			state.isVisible = true;
			state.component = component as (typeof state)['component'];
		},
		hideModal(state) {
			state.isVisible = false;
			state.component = null;
		}
	}
});
