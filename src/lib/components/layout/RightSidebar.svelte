<script lang="ts">
	import { showRightSidebar } from '$lib/stores';
	import Tooltip from '$lib/components/common/Tooltip.svelte';

	import Note from '$lib/components/icons/Note.svelte';
	import Folder from '$lib/components/icons/Folder.svelte';
	import Wrench from '$lib/components/icons/Wrench.svelte';
	import Bookmark from '$lib/components/icons/Bookmark.svelte';

	import ProjectOverviewPanel from '$lib/components/layout/RightSidebar/ProjectOverviewPanel.svelte';
	import FileIngestionPanel from '$lib/components/layout/RightSidebar/FileIngestionPanel.svelte';
	import AgentBuilderPanel from '$lib/components/layout/RightSidebar/AgentBuilderPanel.svelte';
	import BookmarksPanel from '$lib/components/layout/RightSidebar/BookmarksPanel.svelte';

	type RightSidebarTab = 'project-overview' | 'files' | 'agent-builder' | 'bookmarks';

	const tabs: {
		id: RightSidebarTab;
		label: string;
		icon: any;
	}[] = [
		{ id: 'project-overview', label: 'Project Overview', icon: Note },
		{ id: 'files', label: 'Files', icon: Folder },
		{ id: 'agent-builder', label: 'Agent Builder', icon: Wrench },
		{ id: 'bookmarks', label: 'Bookmarks', icon: Bookmark }
	];

	let activeTab: RightSidebarTab = 'project-overview';

	if (typeof window !== 'undefined') {
		localStorage.setItem('ember-right-sidebar-open', 'false');
		showRightSidebar.set(false);
	}
</script>

<aside
	class="h-full relative shrink-0 overflow-hidden"
	style="
		width: {$showRightSidebar ? 320 : 56}px;
		background: var(--ember-shadow);
		transition: width 250ms ease-in-out;
		flex-shrink: 0;
	"
	aria-label="Right panel"
>
	<!-- Accent stripe on left edge -->
	<div class="ember-stripe absolute left-0 top-0 bottom-0 z-10" style="width: 2px;"></div>

	<div class="relative h-full">
		<div
			class="absolute inset-0"
			style="
				width: 320px;
				opacity: {$showRightSidebar ? 1 : 0};
				transition: opacity 150ms ease;
				height: 100%;
				display: flex;
				flex-direction: column;
				pointer-events: {$showRightSidebar ? 'auto' : 'none'}
			"
		>
			<div
				class="flex items-center px-3 shrink-0"
				style="
					height: 56px;
					border-bottom: 0px solid rgba(69,69,69,0.4);
				"
			>
				<span
					style="
						font-size: 14px;
						font-weight: 500;
						color: var(--ember-text-primary);
					"
				>
					Project Dashboard
				</span>

				<div class="flex-1" />

				<Tooltip content="Close panel">
					<button
						type="button"
						class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)] cursor-ew-resize"
						style="
							width: 32px;
							height: 32px;
							color: var(--ember-text-tertiary);
						"
						on:click={() => showRightSidebar.set(false)}
						aria-label="Close panel"
					>
						<!-- Original panel icon (kept for easy revert)
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
							<line x1="15" x2="15" y1="3" y2="21" />
						</svg>
						-->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="18"
							height="18"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
							aria-hidden="true"
						>
							<path d="m9 18 6-6-6-6" />
						</svg>
					</button>
				</Tooltip>
			</div>

			<div
				class="flex items-center gap-2 px-3 shrink-0"
				style="
					margin-top: -2px;
					padding-bottom: 12px;
					border-bottom: 1px solid rgba(69,69,69,0.4);
				"
			>
				{#each tabs as tab (tab.id)}
					<Tooltip content={tab.label}>
						<button
							type="button"
							class="flex items-center justify-center rounded-lg transition-colors {activeTab ===
							tab.id
								? 'ember-glow-subtle'
								: 'hover:bg-[var(--ember-ash)]'}"
							style="
								width: 32px;
								height: 32px;
								background: {activeTab === tab.id ? 'rgba(255,77,0,0.1)' : 'transparent'};
								color: {activeTab === tab.id ? 'var(--ember-flame)' : 'var(--ember-text-tertiary)'};
							"
							on:click={() => {
								activeTab = tab.id;
							}}
							aria-label={tab.label}
						>
							<svelte:component this={tab.icon} className="size-4.5" strokeWidth="1.5" />
						</button>
					</Tooltip>
				{/each}
			</div>

			<div class="flex-1 min-h-0">
				<div
					class="h-full overflow-y-auto ember-scrollbar-hidden"
					style="display: {activeTab === 'project-overview' ? 'block' : 'none'};"
				>
					<ProjectOverviewPanel />
				</div>

				<div
					class="h-full overflow-y-auto ember-scrollbar-hidden"
					style="display: {activeTab === 'files' ? 'block' : 'none'};"
				>
					<FileIngestionPanel />
				</div>

				<div
					class="h-full overflow-y-auto ember-scrollbar-hidden"
					style="display: {activeTab === 'agent-builder' ? 'block' : 'none'};"
				>
					<AgentBuilderPanel />
				</div>

				<div
					class="h-full overflow-y-auto ember-scrollbar-hidden"
					style="display: {activeTab === 'bookmarks' ? 'block' : 'none'};"
				>
					<BookmarksPanel />
				</div>
			</div>
		</div>

		<div
			class="absolute inset-0 flex flex-col items-center pt-3 gap-2"
			style="
				opacity: {$showRightSidebar ? 0 : 1};
				transition: opacity 150ms ease;
				pointer-events: {$showRightSidebar ? 'none' : 'auto'};
			"
		>
			<Tooltip content="Panel">
				<button
					type="button"
					class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)] cursor-ew-resize"
					style="width: 32px; height: 32px; color: var(--ember-text-tertiary);"
					on:click={() => showRightSidebar.set(true)}
					aria-label="Open panel"
				>
					<!-- Original panel icon (kept for easy revert)
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
						<line x1="15" x2="15" y1="3" y2="21" />
					</svg>
					-->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="1.5"
						stroke-linecap="round"
						stroke-linejoin="round"
						aria-hidden="true"
					>
						<path d="m15 18-6-6 6-6" />
					</svg>
				</button>
			</Tooltip>

			{#each tabs as tab (tab.id)}
				<Tooltip content={tab.label} placement="left">
					<button
						type="button"
						class="flex items-center justify-center rounded-lg transition-colors {activeTab ===
						tab.id
							? 'ember-glow-subtle'
							: 'hover:bg-[var(--ember-ash)]'}"
						style="
							width: 32px;
							height: 32px;
							background: {activeTab === tab.id ? 'rgba(255,77,0,0.1)' : 'transparent'};
							color: {activeTab === tab.id ? 'var(--ember-flame)' : 'var(--ember-text-tertiary)'};
						"
						on:click={() => {
							activeTab = tab.id;
							showRightSidebar.set(true);
						}}
						aria-label={tab.label}
					>
						<svelte:component this={tab.icon} className="size-4.5" strokeWidth="1.5" />
					</button>
				</Tooltip>
			{/each}
		</div>
	</div>
</aside>
