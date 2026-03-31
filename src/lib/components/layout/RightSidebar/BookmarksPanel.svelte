<script lang="ts">
	import XMark from '$lib/components/icons/XMark.svelte';

	type BookmarkItem = {
		id: string;
		title: string;
		description: string;
	};

	let pinnedItems: BookmarkItem[] = [
		{ id: 'summary-1', title: 'Summary 1', description: 'Weekly highlights and action items.' },
		{ id: 'insight-a', title: 'Insight A', description: 'Customer interview synthesis.' },
		{ id: 'note-brief', title: 'Brief Note', description: 'Draft messaging checkpoints.' }
	];

	const removeItem = (id: string) => {
		pinnedItems = pinnedItems.filter((item) => item.id !== id);
	};
</script>

<div class="px-3 py-3">
	<div
		style="
			font-size: 15px;
			font-weight: 600;
			color: var(--ember-text-primary);
			margin-top: 0px;
		"
	>
		Bookmarks
	</div>

	<div
		class="mt-3"
		style="
			font-size: 12px;
			font-weight: 500;
			color: var(--ember-text-secondary);
		"
	>
		Pinned Items
	</div>

	{#if pinnedItems.length === 0}
		<div
			class="mt-3 text-center"
			style="
				font-size: 13px;
				color: var(--ember-text-tertiary);
			"
		>
			No pinned items yet.
		</div>
	{:else}
		<div class="mt-2 flex flex-col gap-2">
			{#each pinnedItems as item (item.id)}
				<div
					class="rounded-md px-2.5 py-2 transition-colors hover:bg-[var(--ember-ash)]"
				>
					<div class="flex items-start gap-2">
						<div class="flex-1 min-w-0">
							<div
								class="truncate"
								style="
									font-size: 13px;
									font-weight: 600;
									color: var(--ember-text-primary);
								"
							>
								{item.title}
							</div>
							<div
								class="mt-1"
								style="
									font-size: 12px;
									color: var(--ember-text-tertiary);
								"
							>
								{item.description}
							</div>
						</div>

						<button
							type="button"
							class="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ember-ash)]"
							style="
								width: 26px;
								height: 26px;
								color: var(--ember-text-tertiary);
							"
							aria-label="Remove bookmark"
							on:click={() => {
								removeItem(item.id);
							}}
						>
							<XMark className="size-3.5" strokeWidth="1.5" />
						</button>
					</div>
				</div>
			{/each}
		</div>
	{/if}
</div>
