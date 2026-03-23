<script lang="ts">
	import { showRightSidebar } from '$lib/stores';
</script>

<aside
	class="h-full relative shrink-0 overflow-hidden"
	style="
		width: {$showRightSidebar ? 320 : 0}px;
		background: var(--ember-charcoal);
		transition: width 250ms ease-in-out;
		flex-shrink: 0;
	"
	aria-label="Right panel"
>
	<!-- Accent stripe on left edge -->
	<div
		class="ember-stripe absolute left-0 top-0 bottom-0 z-10"
		style="width: 2px;"
	/>

	<div
		style="
			width: 320px;
			opacity: {$showRightSidebar ? 1 : 0};
			transition: opacity 150ms ease;
			height: 100%;
			display: flex;
			flex-direction: column;
		"
	>
		<!-- Header -->
		<div
			class="flex items-center justify-between px-4 shrink-0"
			style="
				height: 56px;
				border-bottom: 1px solid rgba(69,69,69,0.4);
			"
		>
			<span
				style="
					font-family: 'Archivo', sans-serif;
					font-size: 16px;
					font-weight: 600;
					color: var(--ember-text-tertiary);
				"
			>
				Panel
			</span>
			<button
				on:click={() => showRightSidebar.set(false)}
				class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
				style="width: 32px; height: 32px;"
				aria-label="Close panel"
			>
				<!-- ChevronRight icon -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="none"
					stroke="var(--ember-text-tertiary)"
					stroke-width="1.5"
					stroke-linecap="round"
					stroke-linejoin="round"
					aria-hidden="true"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>
		</div>

		<!-- Empty state -->
		<div
			class="flex flex-col items-center justify-center flex-1"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="48"
				height="48"
				viewBox="0 0 24 24"
				fill="none"
				stroke="var(--ember-flame)"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				style="opacity: 0.2;"
				aria-hidden="true"
			>
				<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
			</svg>
			<span
				style="
					font-size: 13px;
					color: var(--ember-text-tertiary);
					margin-top: 12px;
				"
			>
				Coming soon
			</span>
		</div>
	</div>
</aside>
