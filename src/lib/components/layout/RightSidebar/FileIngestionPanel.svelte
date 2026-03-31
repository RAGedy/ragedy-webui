<script lang="ts">
	import ArrowUpTray from '$lib/components/icons/ArrowUpTray.svelte';
	import ProjectFileList from '$lib/components/layout/RightSidebar/ProjectFileList.svelte';
	import FileUploadDetailsModal from '$lib/components/layout/RightSidebar/FileUploadDetailsModal.svelte';

	let uploadInput: HTMLInputElement | null = null;
	let selectedFile: File | null = null;
	let dragActive = false;
	let showUploadDetailsModal = false;

	const setFile = (file: File | null) => {
		selectedFile = file;
	};

	const onFileChange = (event: Event) => {
		const target = event.currentTarget as HTMLInputElement;
		setFile(target.files?.[0] ?? null);
	};

	const onDropFile = (event: DragEvent) => {
		event.preventDefault();
		dragActive = false;

		const file = event.dataTransfer?.files?.[0] ?? null;
		setFile(file);
	};

	const openFilePicker = () => {
		uploadInput?.click();
	};

	const openUploadDetailsModal = () => {
		if (!selectedFile) return;
		showUploadDetailsModal = true;
	};
</script>

<FileUploadDetailsModal bind:show={showUploadDetailsModal} {selectedFile} />

<div class="px-3 py-3">
	<div
		style="
			font-size: 15px;
			font-weight: 600;
			color: var(--ember-text-primary);
			margin-top: 0px;
		"
	>
		Project Files
	</div>

	<div
		role="button"
		tabindex="0"
		class="mt-3 rounded-lg border-2 border-dashed transition-colors outline-none flex flex-col items-center justify-center gap-2 px-4 py-6"
		style="
			min-height: 176px;
			border-color: {dragActive ? 'var(--ember-flame)' : 'rgba(69,69,69,0.8)'};
			background: {dragActive ? 'rgba(255,77,0,0.08)' : 'transparent'};
		"
		on:click={openFilePicker}
		on:keydown={(event) => {
			if (event.key === 'Enter' || event.key === ' ') {
				event.preventDefault();
				openFilePicker();
			}
		}}
		on:dragover|preventDefault={() => {
			dragActive = true;
		}}
		on:dragleave={() => {
			dragActive = false;
		}}
		on:drop={onDropFile}
	>
		<input
			bind:this={uploadInput}
			type="file"
			class="hidden"
			on:change={onFileChange}
		/>
		<div
			class="size-10 rounded-full flex items-center justify-center"
			style="background: rgba(255,77,0,0.1); color: var(--ember-flame);"
			aria-hidden="true"
		>
			<ArrowUpTray className="size-5" strokeWidth="1.5" />
		</div>
		<div
			style="
				font-size: 13px;
				color: var(--ember-text-secondary);
			"
		>
			Choose a file or drag it here
		</div>
	</div>

	{#if selectedFile}
		<div
			class="mt-3 truncate"
			style="
				font-size: 12px;
				color: var(--ember-text-tertiary);
			"
		>
			Selected: {selectedFile.name}
		</div>

		<button
			type="button"
			class="mt-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
			style="
				background: var(--ember-flame);
				color: #fff;
			"
			on:click={openUploadDetailsModal}
		>
			Upload
		</button>
	{/if}

	<ProjectFileList />
</div>
