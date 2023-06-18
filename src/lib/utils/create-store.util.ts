import { writable } from 'svelte/store';
import { produce, type Draft } from 'immer';

type Args<T> = T extends (...args: [...infer R]) => void ? R : never;
type undefinedArgsToNoArgs<T> = Args<T> extends [undefined] ? () => void : T;

function createReducer<P>(type: string) {
	return function (payload: P) {
		return {
			type,
			payload
		};
	};
}

export function createStore<
	I extends object,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	T extends { [key: string]: (state: Draft<I>, payload?: any) => void }
>({ initialState, reducers }: { initialState: I; reducers: T }) {
	const store = writable(initialState);
	const returnReducers = Object.fromEntries(
		Object.entries(reducers).map(([actionType]) => [actionType, createReducer(actionType)])
	);
	function dispatch<K extends keyof typeof reducers>({
		type,
		payload
	}: {
		type: K;
		payload: Args<(typeof reducers)[K]>[1];
	}) {
		store.update((state) => produce(state, (draft) => reducers[type](draft, payload)));
	}
	return {
		store,
		dispatch,
		reducers: returnReducers as {
			[K in keyof typeof reducers]: (payload: Args<(typeof reducers)[K]>[1]) => {
				type: K;
				payload: typeof payload;
			};
		},
		dispatchReducers: Object.fromEntries(
			Object.entries(returnReducers).map(([actionType, reducer]) => [
				actionType,
				(payload: unknown) => dispatch(reducer(payload))
			])
		) as {
			[K in keyof typeof reducers]: undefinedArgsToNoArgs<
				(payload: Args<(typeof reducers)[K]>[1]) => void
			>;
		}
	};
}
