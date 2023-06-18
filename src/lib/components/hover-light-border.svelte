<script lang="ts">
	import { classNames } from '$lib/utils/class-names.util';

	let hoverDiv: HTMLDivElement;
	let className: string | null = null;
	export let borderClass: string | null = null;
	export { className as class };
	export let lightColor = '#fff8';
	export let lightSize = '100px';
	export let wrapperClass: string | null = null;
	export let borderSize = '2px';
</script>

<div
	class={classNames('overflow-hidden s-gradient w-[inherit] h-[inherit]', className)}
	bind:this={hoverDiv}
	style:--light-color={lightColor}
	style:--light-size={lightSize}
	style:--border-size={borderSize}
>
	<div class={classNames('w-[inherit] h-[inherit] overflow-hidden s-gradient-border', borderClass)}>
		{#if wrapperClass}
			<div class={classNames(wrapperClass, 'w-[inherit] h-[inherit]')}>
				<slot />
			</div>
		{:else}
			<slot />
		{/if}
	</div>
</div>

<svelte:window
	on:mousemove={({ clientX, clientY }) => {
		const { left, top } = hoverDiv.getBoundingClientRect();
		hoverDiv.style.setProperty('--gradient-x', `${clientX - left}px`);
		hoverDiv.style.setProperty('--gradient-y', `${clientY - top}px`);
	}}
/>

<style lang="postcss">
	.s-gradient {
		background-image: radial-gradient(
			var(--light-size) circle at var(--gradient-x) var(--gradient-y),
			var(--light-color),
			transparent 80%
		);
	}
	.s-gradient-border {
		border: var(--border-size) solid transparent;
	}
</style>
