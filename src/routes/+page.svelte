<script>
	import Game from './game.svelte';
	let key = {};
	function restart_game() {
		key = {};
	}
</script>

<div class="relative mx-auto">
	{#key key}
		<Game on:click={restart_game} />
	{/key}
</div>
