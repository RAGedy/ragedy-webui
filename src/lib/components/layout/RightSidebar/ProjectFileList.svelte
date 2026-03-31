<script lang="ts">
	import Eye from '$lib/components/icons/Eye.svelte';
	import EyeSlash from '$lib/components/icons/EyeSlash.svelte';
	import EditPencil from '$lib/components/icons/EditPencil.svelte';

	type ProjectFile = {
		id: string;
		name: string;
		type: string;
		size: string;
		visibility: 'public' | 'private';
		priority: 'high' | 'medium' | 'low';
	};

	const mockFiles: ProjectFile[] = [
		{
			id: 'design-specs',
			name: 'design-specs.pdf',
			type: 'PDF',
			size: '2.4 MB',
			visibility: 'public',
			priority: 'high'
		},
		{
			id: 'meeting-notes',
			name: 'meeting-notes.md',
			type: 'Markdown',
			size: '48 KB',
			visibility: 'private',
			priority: 'medium'
		}
	];

	export let files: ProjectFile[] = mockFiles;

	const getPriorityPillStyle = (priority: ProjectFile['priority']) => {
		if (priority === 'high') {
			return 'background: rgba(255,77,0,0.2); border: 1px solid rgba(255,116,48,0.55); color: #ffc9ad;';
		}

		if (priority === 'medium') {
			return 'background: rgba(255,200,74,0.2); border: 1px solid rgba(255,200,74,0.5); color: #ffe29a;';
		}

		return 'background: var(--ember-stone); border: 1px solid rgba(69,69,69,0.8); color: var(--ember-text-secondary);';
	};
</script>

<div class="mt-3">
	<div
		style="
			font-size: 11px;
			font-weight: 600;
			letter-spacing: 0.35px;
			text-transform: uppercase;
			color: var(--ember-text-tertiary);
		"
	>
		UPLOADED FILES ({files.length})
	</div>

	<div class="mt-2.5 flex flex-col gap-2.5">
		{#each files as file (file.id)}
			<div
				class="rounded-lg px-3 py-2.5"
				style="
					background: var(--ember-charcoal);
					border: 1px solid rgba(69,69,69,0.6);
					box-shadow: 0 2px 10px rgba(0,0,0,0.18);
				"
			>
				<div class="flex items-start gap-3">
					<div class="flex-1 min-w-0">
						<div
							class="truncate"
							style="
								font-size: 13px;
								font-weight: 600;
								color: var(--ember-text-primary);
							"
						>
							{file.name}
						</div>
						<div
							class="mt-0.5 truncate"
							style="
								font-size: 12px;
								color: var(--ember-text-tertiary);
							"
						>
							{file.type} &bull; {file.size}
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
						aria-label={`Edit ${file.name}`}
					>
						<EditPencil className="size-3.5" strokeWidth="1.5" />
					</button>
				</div>

				<div class="mt-2.5 flex items-center gap-2">
					<div
						class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1"
						style="
							height: 26px;
							background: var(--ember-stone);
							border: 1px solid rgba(69,69,69,0.85);
							color: var(--ember-text-secondary);
						"
					>
						{#if file.visibility === 'private'}
							<EyeSlash className="size-3.5" strokeWidth="1.5" />
						{:else}
							<Eye className="size-3.5" strokeWidth="1.5" />
						{/if}
						<span
							style="
								font-size: 12px;
								font-weight: 500;
							"
						>
							{file.visibility}
						</span>
					</div>

					<div
						class="inline-flex items-center rounded-full px-2.5 py-1"
						style={`height: 26px; font-size: 12px; font-weight: 600; text-transform: lowercase; ${getPriorityPillStyle(
							file.priority
						)}`}
					>
						{file.priority}
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
