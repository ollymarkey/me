<script lang="ts">
	import { onMount } from 'svelte';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let items = $state([1, 2, 3, 4]);
	let nextId = 5;
	let ready = $state(false);
	let reducedMotion = $state(true);
	let announcement = $state('Four items. Try mixing them up.');
	let duration = $derived(reducedMotion ? 0 : 350);

	onMount(() => {
		const preference = matchMedia('(prefers-reduced-motion: reduce)');
		const update = () => { reducedMotion = preference.matches; };
		update();
		preference.addEventListener('change', update);
		ready = true;
		return () => preference.removeEventListener('change', update);
	});

	function add() {
		if (items.length >= 6) return;
		const id = nextId++;
		items = [...items, id];
		announcement = `Added item ${id}. ${items.length} items.`;
	}

	function remove() {
		const id = items.at(-1);
		items = items.slice(0, -1);
		announcement = items.length ? `Removed item ${id}. ${items.length} items.` : 'List cleared. Add an item to start again.';
	}

	function shuffle() {
		const shuffled = [...items];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		if (shuffled.every((id, index) => id === items[index])) shuffled.push(shuffled.shift()!);
		items = shuffled;
		announcement = 'Order shuffled. Each item keeps its identity.';
	}

	function sort() {
		items = [...items].sort((a, b) => a - b);
		announcement = 'Sorted by item number.';
	}
</script>

<div class="list-playground" data-ready={ready}>
	<div class="list-toolbar" role="group" aria-label="List controls">
		<button class="demo-button" disabled={!ready || items.length >= 6} onclick={add}>Add</button>
		<button class="demo-button" disabled={!ready || !items.length} onclick={remove}>Remove</button>
		<button class="demo-button" disabled={!ready || items.length < 2} onclick={shuffle}>Shuffle</button>
		<button class="demo-button" disabled={!ready || items.length < 2} onclick={sort}>Sort</button>
	</div>
	<ul class="playground-items" aria-label="Animated items">
		{#each items as id (id)}
			<li animate:flip={{ duration, easing: cubicOut }} transition:fly={{ y: reducedMotion ? 0 : 12, duration, easing: cubicOut }}>
				<span class="list-item-number">{String(id).padStart(2, '0')}</span>
				<span>Item {id}</span>
				<span class="list-item-track" aria-hidden="true"><span style:width={`${30 + (id * 17) % 70}%`}></span></span>
			</li>
		{/each}
	</ul>
	{#if !items.length}<p class="list-empty">A clean slate. Add an item to get things moving.</p>{/if}
	<p class="demo-note" role="status">{announcement}</p>
	<p class="demo-note">Up to six items. Keyed identity, enter/exit transitions, and FLIP movement.</p>
</div>
