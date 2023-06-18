<script lang="typescript">
	import { modalStore, hideModal } from '$lib/stores/modal.store';
	import { fade } from 'svelte/transition';
	function hideOnEscapePressed(e: KeyboardEvent) {
		if (e.key === 'Escape') hideModal();
	}
</script>

{#if $modalStore.isVisible}
	<div
		transition:fade
		class="absolute inset-0 z-50 flex items-center justify-center bg-white bg-opacity-10 backdrop-blur-sm"
		on:click={hideModal}
		on:keydown={hideOnEscapePressed}
	>
		<div
			class="w-[inherit] h-[inherit]"
			on:click|stopPropagation={() => {}}
			on:keydown={hideOnEscapePressed}
		>
			<svelte:component this={$modalStore.component} />
		</div>
	</div>
{/if}
<svelte:window on:keydown={hideOnEscapePressed} />
