<script lang="ts">
	import { swipe } from 'svelte-gestures';
	import { create_fake_array } from '$lib/utils/create-fake-array.util';
	import { tick } from 'svelte';
	import { linear } from 'svelte/easing';
	import { blur, fade, type TransitionConfig } from 'svelte/transition';

	type Vec = [number, number];
	const board_size = 25;
	const directions = {
		up: [-1, 0],
		down: [1, 0],
		left: [0, -1],
		right: [0, 1]
	} satisfies Record<string, Vec>;

	let direction: Vec = directions.right;
	let snake = [{ body: [0, 0], direction: directions.right }] satisfies Array<Record<string, Vec>>;
	let apple_position: Vec = [10, 10];
	let interval: number = -1;
	let is_playing = true;
	let is_game_over = false;
	let speed = 200;

	$: score = snake.length;
	$: effective_speed = is_game_over ? speed : Math.max(speed - score * 5, 50);
	$: if (is_playing) {
		clearInterval(interval);
		interval = setInterval(game_loop, effective_speed);
	}
	$: if (!is_playing) {
		clearInterval(interval);
	}

	async function game_loop() {
		let tmp_snake = snake;
		const {
			body: [row, col]
		} = tmp_snake.at(-1)!;
		const new_head = [
			Math.max(Math.min(row + direction[0], board_size - 1), 0),
			Math.max(Math.min(col + direction[1], board_size - 1), 0)
		] satisfies Vec;
		if (is_pos_equal(new_head, apple_position)) {
			apple_position = [
				Math.floor(Math.random() * board_size),
				Math.floor(Math.random() * board_size)
			];
		} else {
			tmp_snake.shift();
		}
		if (tmp_snake.find(({ body }) => is_pos_equal(body, new_head))) {
			speed = 750;
			await tick();
			is_playing = false;
			is_game_over = true;
			return;
		}
		tmp_snake.push({ body: new_head, direction });
		snake = tmp_snake;
	}
	function snake_move_anim(
		_node: Element,
		{ reverse, is_out, row, col }: { reverse: boolean; is_out: boolean; row: number; col: number }
	) {
		let _direction = direction;
		if (is_out) {
			const {
				body: [end_row, end_col]
			} = snake.at(0)!;
			_direction = [end_row - row, end_col - col];
		}
		const size = _direction[1] ? 'width' : 'height';
		const position_start = _direction[1] ? 'right' : 'top';
		const position_end = _direction[1] ? 'left' : 'bottom';
		const is_reverse = !(reverse !== (_direction[0] < 0 || _direction[1] > 0));
		return {
			duration: effective_speed,
			css: (t) => {
				const eased = linear(t);

				return `
                    position:absolute;
                    ${is_reverse ? `${position_start}:0;` : `${position_end}:0;`}
                    ${size}: ${eased * 100}%;
					`;
			}
		} satisfies TransitionConfig;
	}
	function out_anim(node: Element, options: any) {
		if (is_game_over) {
			return fade(node, options);
		} else {
			return snake_move_anim(node, options);
		}
	}
	function is_pos_equal(
		[x1, y1]: Vec | undefined = [NaN, NaN],
		[x2, y2]: Vec | undefined = [NaN, NaN]
	) {
		return x1 === x2 && y1 === y2;
	}
	function handle_controls<T extends { key: string }>(e: T) {
		const head_direction = snake.at(-1)?.direction;
		const is_one_block = snake.length === 1;
		switch (e.key) {
			case 'ArrowUp':
				if (!is_pos_equal(head_direction, directions.down) || is_one_block)
					direction = directions.up;
				break;
			case 'ArrowDown':
				if (!is_pos_equal(head_direction, directions.up) || is_one_block)
					direction = directions.down;
				break;
			case 'ArrowLeft':
				if (!is_pos_equal(head_direction, directions.right) || is_one_block)
					direction = directions.left;
				break;
			case 'ArrowRight':
				if (!is_pos_equal(head_direction, directions.left) || is_one_block)
					direction = directions.right;
				break;
		}
	}
	function map_direction_to_key(direction: string) {
		switch (direction) {
			case 'left':
				return 'ArrowLeft';
			case 'right':
				return 'ArrowRight';
			case 'top':
				return 'ArrowUp';
			case 'bottom':
				return 'ArrowDown';
		}
		return '';
	}
</script>

<svelte:window on:keydown={handle_controls} />
<div
	class="flex flex-col m-2 w-fit mx-auto border-[2px] absolute left-1/2 -translate-x-1/2"
	in:fade
	out:fade
	use:swipe
	on:swipe={(e) => {
		e.preventDefault();
		handle_controls({ key: map_direction_to_key(e.detail.direction) });
	}}
>
	{#each create_fake_array(board_size) as row}
		<div class="flex items-center justify-center">
			{#each create_fake_array(board_size) as col}
				<div class="relative w-[min(3.8vh,3.8vw)] h-[min(3.8vh,3.8vw)] bg-black">
					{#if !is_game_over && apple_position && is_pos_equal(apple_position, [row, col])}
						<div in:fade out:blur class="absolute z-10 w-full h-full bg-red-600 animate-pulse" />
					{/if}
					{#if !is_game_over && snake.find(({ body }) => is_pos_equal(body, [row, col]))}
						<div
							in:snake_move_anim={{ reverse: false, is_out: false, row, col }}
							out:out_anim={{ reverse: true, is_out: true, row, col }}
							class="absolute z-20 w-full h-full bg-white border-red-600 border-solid s-snake-body"
						/>
					{/if}
				</div>
			{/each}
		</div>
	{/each}
	{#if is_game_over}
		<div
			in:fade
			class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-4xl font-bold text-white uppercase"
		>
			game over
			<button
				on:click
				class="p-4 capitalize transition-all duration-500 hover:bg-white hover:text-black"
				>play again</button
			>
		</div>
	{/if}
</div>

<div class="absolute flex gap-5 text-lg font-bold text-white uppercase">
	<h2>score</h2>
	<div>
		{score}
	</div>
</div>
