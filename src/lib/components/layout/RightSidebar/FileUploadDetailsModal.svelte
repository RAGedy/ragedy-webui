<script lang="ts">
	import Modal from '$lib/components/common/Modal.svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	export let show = false;
	export let selectedFile: File | null = null;

	let visibility = 'project-wide';
	let priority = '';
	let contextNote = '';
	let lastSelectedFileKey = '';

	const visibilityOptions = ['Private', 'Project-wide', 'Public', 'Role-based'];
	const priorityOptions = [
		{ label: 'None', value: '' },
		{ label: 'High', value: 'high' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Low', value: 'low' }
	];

	const closeModal = () => {
		show = false;
	};

	const formatFileSize = (size: number) => {
		if (size < 1024) return `${size} B`;
		if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
		return `${(size / (1024 * 1024)).toFixed(1)} MB`;
	};

	$: if (show) {
		const currentKey = selectedFile ? `${selectedFile.name}-${selectedFile.size}` : 'no-file';

		if (lastSelectedFileKey !== currentKey) {
			visibility = 'project-wide';
			priority = '';
			contextNote = '';
			lastSelectedFileKey = currentKey;
		}
	}
</script>

<Modal size="sm" bind:show>
	<div>
		<div class="flex justify-between dark:text-gray-100 px-5 pt-4 pb-1.5">
			<h1 class="text-lg font-medium self-center font-primary">
				File Upload
			</h1>
			<button
				class="self-center"
				aria-label="Close modal"
				on:click={closeModal}
			>
				<XMark className="size-5" />
			</button>
		</div>

		<div class="px-4 pb-4 dark:text-gray-200">
			{#if selectedFile}
				<div
					class="rounded-lg px-3 py-2"
					style="
						background: var(--ember-shadow);
						border: 1px solid rgba(69,69,69,0.6);
					"
				>
					<div
						style="
							font-size: 11px;
							font-weight: 500;
							color: var(--ember-text-tertiary);
							letter-spacing: 0.3px;
							text-transform: uppercase;
						"
					>
						Selected file
					</div>
					<div
						class="truncate mt-1"
						style="
							font-size: 13px;
							font-weight: 600;
							color: var(--ember-text-primary);
						"
					>
						{selectedFile.name}
					</div>
					<div
						style="
							font-size: 12px;
							color: var(--ember-text-secondary);
							margin-top: 2px;
						"
					>
						{formatFileSize(selectedFile.size)}
					</div>
				</div>
			{/if}

			<div class="mt-3 flex flex-col gap-2.5">
				<label
					for="file-visibility-modal"
					style="
						font-size: 12px;
						color: var(--ember-text-secondary);
					"
				>
					Visibility
				</label>
				<select
					id="file-visibility-modal"
					bind:value={visibility}
					class="rounded-lg px-2.5 outline-none"
					style="
						height: 36px;
						background: var(--ember-stone);
						border: 1px solid transparent;
						color: var(--ember-text-primary);
						font-size: 13px;
					"
				>
					{#each visibilityOptions as option}
						<option value={option.toLowerCase()}>{option}</option>
					{/each}
				</select>

				<label
					for="file-priority-modal"
					style="
						font-size: 12px;
						color: var(--ember-text-secondary);
					"
				>
					Priority
				</label>
				<select
					id="file-priority-modal"
					bind:value={priority}
					class="rounded-lg px-2.5 outline-none"
					style="
						height: 36px;
						background: var(--ember-stone);
						border: 1px solid transparent;
						color: var(--ember-text-primary);
						font-size: 13px;
					"
				>
					{#each priorityOptions as option}
						<option value={option.value}>{option.label}</option>
					{/each}
				</select>

				<label
					for="file-context-modal"
					style="
						font-size: 12px;
						color: var(--ember-text-secondary);
					"
				>
					User-defined context
				</label>
				<textarea
					id="file-context-modal"
					bind:value={contextNote}
					rows="4"
					placeholder="Add context for this file..."
					class="rounded-lg px-2.5 py-2 outline-none resize-vertical"
					style="
						background: var(--ember-stone);
						border: 1px solid transparent;
						color: var(--ember-text-primary);
						font-size: 13px;
					"
				></textarea>
			</div>

			<div class="mt-4 flex justify-end gap-2">
				<button
					type="button"
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--ember-ash)]"
					style="
						background: var(--ember-stone);
						border: 1px solid rgba(69,69,69,0.75);
						color: var(--ember-text-primary);
					"
					on:click={closeModal}
				>
					Cancel
				</button>
				<button
					type="button"
					class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
					style="
						background: var(--ember-flame);
						color: #fff;
					"
					on:click={closeModal}
				>
					Upload
				</button>
			</div>
		</div>
	</div>
</Modal>
