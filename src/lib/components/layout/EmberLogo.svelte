<script lang="ts">
	export let size: number = 24;
</script>

<span
	class="inline-flex items-center justify-center"
	style="width: {size}px; height: {size}px;"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={size}
		height={size}
		viewBox="0 0 24 24"
		fill="none"
		stroke="var(--ember-flame)"
		stroke-width="1.5"
		stroke-linecap="round"
		stroke-linejoin="round"
		style="filter: drop-shadow(0 0 6px rgba(255,77,0,0.5));"
		aria-hidden="true"
	>
		<!-- Lucide Flame icon path -->
		<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
	</svg>
</span>
