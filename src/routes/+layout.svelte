<script lang="ts">
	import Modal from '$lib/containers/modal.svelte';
	import { Toaster } from 'svelte-french-toast';
	import '$lib/configs/globals.css';
</script>

<Modal />
<Toaster />

<slot />

<style lang="postcss" global>
	body {
		@apply antialiased;
		@apply bg-black;
	}
</style>
