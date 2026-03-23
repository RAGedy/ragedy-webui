<script lang="ts">
	import { getContext } from 'svelte';
	import { toast } from 'svelte-sonner';

	import {
		WEBUI_NAME,
		banners,
		chatId,
		config,
		mobile,
		settings,
		showArchivedChats,
		showControls,
		showSidebar,
		showRightSidebar,
		temporaryChatEnabled,
		user
	} from '$lib/stores';

	import { slide } from 'svelte/transition';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import ShareChatModal from '../chat/ShareChatModal.svelte';
	import ModelSelector from '../chat/ModelSelector.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import Menu from '$lib/components/layout/Navbar/Menu.svelte';
	import UserMenu from '$lib/components/layout/Sidebar/UserMenu.svelte';
	import AdjustmentsHorizontal from '../icons/AdjustmentsHorizontal.svelte';

	import PencilSquare from '../icons/PencilSquare.svelte';
	import Banner from '../common/Banner.svelte';
	import Sidebar from '../icons/Sidebar.svelte';

	import ChatBubbleDotted from '../icons/ChatBubbleDotted.svelte';
	import ChatBubbleDottedChecked from '../icons/ChatBubbleDottedChecked.svelte';

	import EllipsisHorizontal from '../icons/EllipsisHorizontal.svelte';
	import ChatPlus from '../icons/ChatPlus.svelte';
	import ChatCheck from '../icons/ChatCheck.svelte';
	import Knobs from '../icons/Knobs.svelte';
	import { WEBUI_API_BASE_URL } from '$lib/constants';

	const i18n = getContext('i18n');

	export let initNewChat: Function;
	export let shareEnabled: boolean = false;
	export let scrollTop = 0;

	export let chat;
	export let history;
	export let selectedModels;
	export let showModelSelector = true;

	export let onSaveTempChat: () => {};
	export let archiveChatHandler: (id: string) => void;
	export let moveChatHandler: (id: string, folderId: string) => void;

	let closedBannerIds = [];

	let showShareChatModal = false;
	let showDownloadChatModal = false;
</script>

<ShareChatModal bind:show={showShareChatModal} chatId={$chatId} />

<button
	id="new-chat-button"
	class="hidden"
	on:click={() => {
		initNewChat();
	}}
	aria-label="New Chat"
/>

<nav
	class="sticky top-0 z-30 w-full flex flex-col items-center drag-region"
	style="background: linear-gradient(to bottom, #212121 0%, #212121 60%, transparent 100%);"
>
	<!-- ── Ember Chat Navbar (56px) ── -->
	<div class="flex items-center w-full px-4 gap-3" style="height: 56px;">

		<!-- Left: sidebar hamburger (when sidebar closed) + model selector pills -->
		<div class="flex items-center gap-2 shrink-0">
			{#if !$showSidebar}
				<button
					on:click={() => showSidebar.set(true)}
					class="flex items-center justify-center shrink-0 rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
					style="width: 32px; height: 32px;"
					aria-label={$i18n.t('Open Sidebar')}
				>
					<!-- Menu icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
				</button>
			{/if}

			{#if showModelSelector}
				<ModelSelector bind:selectedModels showSetDefault={!shareEnabled} />
			{/if}
		</div>

		<!-- Center: chat title -->
		<div class="flex-1 flex justify-center min-w-0 overflow-hidden">
			{#if chat?.title && chat?.id}
				<span
					class="truncate max-w-[300px]"
					style="font-size: 14px; color: var(--ember-text-secondary);"
				>
					{chat.title}
				</span>
			{/if}
		</div>

		<!-- Right: action buttons -->
		<div class="flex items-center gap-1">
			<!-- Temporary Chat toggle -->
			{#if $user?.role === 'user' ? ($user?.permissions?.chat?.temporary ?? true) && !($user?.permissions?.chat?.temporary_enforced ?? false) : true}
				{#if !chat?.id}
					<Tooltip content={$i18n.t('Temporary Chat')}>
						<button
							id="temporary-chat-button"
							class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)] {$temporaryChatEnabled ? 'bg-[rgba(255,77,0,0.1)]' : ''}"
							style="width: 32px; height: 32px;"
							on:click={async () => {
								if (($settings?.temporaryChatByDefault ?? false) && $temporaryChatEnabled) {
									await temporaryChatEnabled.set(null);
								} else {
									await temporaryChatEnabled.set(!$temporaryChatEnabled);
								}
								if ($page.url.pathname !== '/') { await goto('/'); }
								if ($temporaryChatEnabled) {
									window.history.replaceState(null, '', '?temporary-chat=true');
								} else {
									window.history.replaceState(null, '', location.pathname);
								}
							}}
						>
							{#if $temporaryChatEnabled}
								<ChatBubbleDottedChecked className="size-4.5" strokeWidth="1.5" />
							{:else}
								<ChatBubbleDotted className="size-4.5" strokeWidth="1.5" />
							{/if}
						</button>
					</Tooltip>
				{:else if $temporaryChatEnabled}
					<Tooltip content={$i18n.t('Save Chat')}>
						<button
							id="save-temporary-chat-button"
							class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
							style="width: 32px; height: 32px;"
							on:click={async () => { onSaveTempChat(); }}
						>
							<ChatCheck className="size-4.5" strokeWidth="1.5" />
						</button>
					</Tooltip>
				{/if}
			{/if}

			<!-- Share / Menu (when chat exists) -->
			{#if shareEnabled && chat && (chat.id || $temporaryChatEnabled)}
				<Menu
					{chat}
					{shareEnabled}
					shareHandler={() => { showShareChatModal = !showShareChatModal; }}
					archiveChatHandler={() => { archiveChatHandler(chat.id); }}
					{moveChatHandler}
				>
					<button
						id="chat-context-menu-button"
						class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
						style="width: 32px; height: 32px;"
					>
						<!-- Share2 icon -->
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>
					</button>
				</Menu>
			{/if}

			<!-- Controls toggle (SlidersHorizontal) -->
			{#if $user?.role === 'admin' || ($user?.permissions?.chat?.controls ?? true)}
				<Tooltip content={$i18n.t('Controls')}>
					<button
						class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)] {$showControls ? 'bg-[rgba(255,77,0,0.1)]' : ''}"
						style="width: 32px; height: 32px;"
						on:click={async () => { await showControls.set(!$showControls); }}
						aria-label={$i18n.t('Controls')}
					>
						<AdjustmentsHorizontal className="size-4.5" strokeWidth="1.5" />
					</button>
				</Tooltip>
			{/if}

			<!-- Right Sidebar toggle (PanelRight) -->
			<Tooltip content={$i18n.t('Panel')}>
				<button
					class="flex items-center justify-center rounded-lg transition-colors {$showRightSidebar ? 'ember-glow-subtle' : 'hover:bg-[var(--ember-ash)]'}"
					style="
						width: 32px;
						height: 32px;
						background: {$showRightSidebar ? 'rgba(255,77,0,0.1)' : 'transparent'};
					"
					on:click={() => showRightSidebar.set(!$showRightSidebar)}
					aria-label={$i18n.t('Toggle Panel')}
				>
					<!-- PanelRight icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="{$showRightSidebar ? 'var(--ember-flame)' : 'var(--ember-text-tertiary)'}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="15" x2="15" y1="3" y2="21"/></svg>
				</button>
			</Tooltip>
		</div>
	</div>

	{#if $temporaryChatEnabled && ($chatId ?? '').startsWith('local:')}
		<div class="w-full z-30 text-center">
			<div class="text-xs" style="color: var(--ember-text-tertiary);">{$i18n.t('Temporary Chat')}</div>
		</div>
	{/if}

	<div class="absolute top-[100%] left-0 right-0 h-fit">
		{#if !history.currentId && !$chatId && ($banners.length > 0 || ($config?.license_metadata?.type ?? null) === 'trial' || (($config?.license_metadata?.seats ?? null) !== null && $config?.user_count > $config?.license_metadata?.seats))}
			<div class=" w-full z-30">
				<div class=" flex flex-col gap-1 w-full">
					{#if ($config?.license_metadata?.type ?? null) === 'trial'}
						<Banner
							banner={{
								type: 'info',
								title: 'Trial License',
								content: $i18n.t(
									'You are currently using a trial license. Please contact support to upgrade your license.'
								)
							}}
						/>
					{/if}

					{#if ($config?.license_metadata?.seats ?? null) !== null && $config?.user_count > $config?.license_metadata?.seats}
						<Banner
							banner={{
								type: 'error',
								title: 'License Error',
								content: $i18n.t(
									'Exceeded the number of seats in your license. Please contact support to increase the number of seats.'
								)
							}}
						/>
					{/if}

					{#each $banners.filter((b) => ![...JSON.parse(localStorage.getItem('dismissedBannerIds') ?? '[]'), ...closedBannerIds].includes(b.id)) as banner (banner.id)}
						<Banner
							{banner}
							on:dismiss={(e) => {
								const bannerId = e.detail;

								if (banner.dismissible) {
									localStorage.setItem(
										'dismissedBannerIds',
										JSON.stringify(
											[
												bannerId,
												...JSON.parse(localStorage.getItem('dismissedBannerIds') ?? '[]')
											].filter((id) => $banners.find((b) => b.id === id))
										)
									);
								} else {
									closedBannerIds = [...closedBannerIds, bannerId];
								}
							}}
						/>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</nav>
