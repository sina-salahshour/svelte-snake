<script>
	import Game from './game.svelte';
	let key = {};
	function restart_game() {
		key = {};
	}
</script>

<svelte:head>
	<title>snake</title>
	<meta property="og:title" content="The Snake" />
	<meta property="og:site_name" content="snake" />
	<meta property="og:url" content="https://snake.drhexe.ir" />
	<meta
		property="og:description"
		content="Snake is a sub-genre of action video games where the player maneuvers the end of a growing line, often themed as a snake."
	/>
	<meta property="og:type" content="website" />
	<meta property="og:image" content="https://snake.drhexe.ir/images/snake-image.png" />
</svelte:head>
<div class="relative w-screen h-screen mx-auto">
	{#key key}
		<Game on:click={restart_game} />
	{/key}
</div>
