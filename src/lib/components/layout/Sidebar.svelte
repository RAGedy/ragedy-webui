<script lang="ts">
	import { toast } from 'svelte-sonner';
	import { v4 as uuidv4 } from 'uuid';

	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import {
		user,
		chats,
		settings,
		showSettings,
		chatId,
		tags,
		folders as _folders,
		showSidebar,
		showSearch,
		mobile,
		showArchivedChats,
		pinnedChats,
		scrollPaginationEnabled,
		currentChatPage,
		temporaryChatEnabled,
		channels,
		socket,
		config,
		isApp,
		models,
		selectedFolder,
		WEBUI_NAME,
		sidebarWidth,
		activeChatIds
	} from '$lib/stores';
	import { onMount, getContext, tick, onDestroy } from 'svelte';

	const i18n = getContext('i18n');

	import {
		getChatList,
		getAllTags,
		getPinnedChatList,
		toggleChatPinnedStatusById,
		getChatById,
		updateChatFolderIdById,
		importChats
	} from '$lib/apis/chats';
	import { createNewFolder, getFolders, updateFolderParentIdById } from '$lib/apis/folders';
	import { checkActiveChats } from '$lib/apis/tasks';
	import { WEBUI_API_BASE_URL, WEBUI_BASE_URL } from '$lib/constants';

	import ArchivedChatsModal from './ArchivedChatsModal.svelte';
	import UserMenu from './Sidebar/UserMenu.svelte';
	import ChatItem from './Sidebar/ChatItem.svelte';
	import Spinner from '../common/Spinner.svelte';
	import Loader from '../common/Loader.svelte';
	import Folder from '../common/Folder.svelte';
	import Tooltip from '../common/Tooltip.svelte';
	import Folders from './Sidebar/Folders.svelte';
	import { getChannels, createNewChannel } from '$lib/apis/channels';
	import ChannelModal from './Sidebar/ChannelModal.svelte';
	import ChannelItem from './Sidebar/ChannelItem.svelte';
	import PencilSquare from '../icons/PencilSquare.svelte';
	import Search from '../icons/Search.svelte';
	import SearchModal from './SearchModal.svelte';
	import FolderModal from './Sidebar/Folders/FolderModal.svelte';
	import Sidebar from '../icons/Sidebar.svelte';
	import PinnedModelList from './Sidebar/PinnedModelList.svelte';
	import Note from '../icons/Note.svelte';
	import { slide } from 'svelte/transition';
	import HotkeyHint from '../common/HotkeyHint.svelte';
	import EmberLogo from './EmberLogo.svelte';

	const BREAKPOINT = 768;

	let scrollTop = 0;

	let navElement;
	let shiftKey = false;

	let selectedChatId = null;
	let showCreateChannel = false;

	// Pagination variables
	let chatListLoading = false;
	let allChatsLoaded = false;

	let showCreateFolderModal = false;

	let pinnedModels = [];

	let showPinnedModels = false;
	let showChannels = false;
	let showFolders = false;

	let folders = {};
	let folderRegistry = {};

	let newFolderId = null;

	$: if ($selectedFolder) {
		initFolders();
	}

	const initFolders = async () => {
		if ($config?.features?.enable_folders === false) {
			return;
		}

		const folderList = await getFolders(localStorage.token).catch((error) => {
			return [];
		});
		_folders.set(folderList.sort((a, b) => b.updated_at - a.updated_at));

		folders = {};

		// First pass: Initialize all folder entries
		for (const folder of folderList) {
			// Ensure folder is added to folders with its data
			folders[folder.id] = { ...(folders[folder.id] || {}), ...folder };

			if (newFolderId && folder.id === newFolderId) {
				folders[folder.id].new = true;
				newFolderId = null;
			}
		}

		// Second pass: Tie child folders to their parents
		for (const folder of folderList) {
			if (folder.parent_id) {
				// Ensure the parent folder is initialized if it doesn't exist
				if (!folders[folder.parent_id]) {
					folders[folder.parent_id] = {}; // Create a placeholder if not already present
				}

				// Initialize childrenIds array if it doesn't exist and add the current folder id
				folders[folder.parent_id].childrenIds = folders[folder.parent_id].childrenIds
					? [...folders[folder.parent_id].childrenIds, folder.id]
					: [folder.id];

				// Sort the children by updated_at field
				folders[folder.parent_id].childrenIds.sort((a, b) => {
					return folders[b].updated_at - folders[a].updated_at;
				});
			}
		}
	};

	const createFolder = async ({ name, data, parent_id }) => {
		name = name?.trim();
		if (!name) {
			toast.error($i18n.t('Folder name cannot be empty.'));
			return;
		}

		// Check for duplicate names in the same parent
		const siblings = Object.values(folders).filter((folder) => folder.parent_id === parent_id);
		if (siblings.find((folder) => folder.name.toLowerCase() === name.toLowerCase())) {
			// If a folder with the same name already exists, append a number to the name
			let i = 1;
			while (
				siblings.find((folder) => folder.name.toLowerCase() === `${name} ${i}`.toLowerCase())
			) {
				i++;
			}

			name = `${name} ${i}`;
		}

		// Add a dummy folder to the list to show the user that the folder is being created
		const tempId = uuidv4();
		folders = {
			...folders,
			[tempId]: {
				id: tempId,
				name: name,
				parent_id: parent_id,
				created_at: Date.now(),
				updated_at: Date.now()
			}
		};

		const res = await createNewFolder(localStorage.token, {
			name,
			data,
			parent_id
		}).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (res) {
			// newFolderId = res.id;
			await initFolders();
			showFolders = true;
		}
	};

	const initChannels = async () => {
		// default (none), group, dm type
		const res = await getChannels(localStorage.token).catch((error) => {
			return null;
		});

		if (res) {
			await channels.set(
				res.sort(
					(a, b) =>
						['', null, 'group', 'dm'].indexOf(a.type) - ['', null, 'group', 'dm'].indexOf(b.type)
				)
			);
		}
	};

	const initChatList = async () => {
		// Reset pagination variables
		console.log('initChatList');
		currentChatPage.set(1);
		allChatsLoaded = false;
		scrollPaginationEnabled.set(false);

		initFolders();
		await Promise.all([
			await (async () => {
				console.log('Init tags');
				const _tags = await getAllTags(localStorage.token);
				tags.set(_tags);
			})(),
			await (async () => {
				console.log('Init pinned chats');
				const _pinnedChats = await getPinnedChatList(localStorage.token);
				pinnedChats.set(_pinnedChats);
			})(),
			await (async () => {
				console.log('Init chat list');
				const _chats = await getChatList(localStorage.token, $currentChatPage);
				await chats.set(_chats);
			})()
		]);

		// Enable pagination
		scrollPaginationEnabled.set(true);
	};

	const loadMoreChats = async () => {
		chatListLoading = true;

		currentChatPage.set($currentChatPage + 1);

		let newChatList = [];

		newChatList = await getChatList(localStorage.token, $currentChatPage);

		// once the bottom of the list has been reached (no results) there is no need to continue querying
		allChatsLoaded = newChatList.length === 0;
		await chats.set([...($chats ? $chats : []), ...newChatList]);

		chatListLoading = false;
	};

	const importChatHandler = async (items, pinned = false, folderId = null) => {
		console.log('importChatHandler', items, pinned, folderId);
		for (const item of items) {
			console.log(item);
			if (item.chat) {
				await importChats(localStorage.token, [
					{
						chat: item.chat,
						meta: item?.meta ?? {},
						pinned: pinned,
						folder_id: folderId,
						created_at: item?.created_at ?? null,
						updated_at: item?.updated_at ?? null
					}
				]);
			}
		}

		initChatList();
	};

	const inputFilesHandler = async (files) => {
		console.log(files);

		for (const file of files) {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const content = e.target.result;

				try {
					const chatItems = JSON.parse(content);
					importChatHandler(chatItems);
				} catch {
					toast.error($i18n.t(`Invalid file format.`));
				}
			};

			reader.readAsText(file);
		}
	};

	const tagEventHandler = async (type, tagName, chatId) => {
		console.log(type, tagName, chatId);
		if (type === 'delete') {
			initChatList();
		} else if (type === 'add') {
			initChatList();
		}
	};

	let draggedOver = false;

	const onDragOver = (e) => {
		e.preventDefault();

		// Check if a file is being draggedOver.
		if (e.dataTransfer?.types?.includes('Files')) {
			draggedOver = true;
		} else {
			draggedOver = false;
		}
	};

	const onDragLeave = () => {
		draggedOver = false;
	};

	const onDrop = async (e) => {
		e.preventDefault();
		console.log(e); // Log the drop event

		// Perform file drop check and handle it accordingly
		if (e.dataTransfer?.files) {
			const inputFiles = Array.from(e.dataTransfer?.files);

			if (inputFiles && inputFiles.length > 0) {
				console.log(inputFiles); // Log the dropped files
				inputFilesHandler(inputFiles); // Handle the dropped files
			}
		}

		draggedOver = false; // Reset draggedOver status after drop
	};

	let touchstart;
	let touchend;

	function checkDirection() {
		const screenWidth = window.innerWidth;
		const swipeDistance = Math.abs(touchend.screenX - touchstart.screenX);
		if (touchstart.clientX < 40 && swipeDistance >= screenWidth / 8) {
			if (touchend.screenX < touchstart.screenX) {
				showSidebar.set(false);
			}
			if (touchend.screenX > touchstart.screenX) {
				showSidebar.set(true);
			}
		}
	}

	const onTouchStart = (e) => {
		touchstart = e.changedTouches[0];
		console.log(touchstart.clientX);
	};

	const onTouchEnd = (e) => {
		touchend = e.changedTouches[0];
		checkDirection();
	};

	const onKeyDown = (e) => {
		if (e.key === 'Shift') {
			shiftKey = true;
		}
	};

	const onKeyUp = (e) => {
		if (e.key === 'Shift') {
			shiftKey = false;
		}
	};

	const onFocus = () => {};

	const onBlur = () => {
		shiftKey = false;
		selectedChatId = null;
	};

	const MIN_WIDTH = 220;
	const MAX_WIDTH = 480;

	let isResizing = false;

	let startWidth = 0;
	let startClientX = 0;

	const resizeStartHandler = (e: MouseEvent) => {
		if ($mobile) return;
		isResizing = true;

		startClientX = e.clientX;
		startWidth = $sidebarWidth ?? 260;

		document.body.style.userSelect = 'none';
	};

	const resizeEndHandler = () => {
		if (!isResizing) return;
		isResizing = false;

		document.body.style.userSelect = '';
		localStorage.setItem('sidebarWidth', String($sidebarWidth));
	};

	const resizeSidebarHandler = (endClientX) => {
		const dx = endClientX - startClientX;
		const newSidebarWidth = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, startWidth + dx));

		sidebarWidth.set(newSidebarWidth);
		document.documentElement.style.setProperty('--sidebar-width', `${newSidebarWidth}px`);
	};

	onMount(() => {
		try {
			const width = Number(localStorage.getItem('sidebarWidth'));
			if (!Number.isNaN(width) && width >= MIN_WIDTH && width <= MAX_WIDTH) {
				sidebarWidth.set(width);
			}
		} catch {}

		document.documentElement.style.setProperty('--sidebar-width', `${$sidebarWidth}px`);
		sidebarWidth.subscribe((w) => {
			document.documentElement.style.setProperty('--sidebar-width', `${w}px`);
		});

		// Default: open on desktop (Ember design), closed on mobile
		showSidebar.set(!$mobile ? localStorage.sidebar !== 'false' : false);

		const unsubscribers = [
			mobile.subscribe((value) => {
				if ($showSidebar && value) {
					showSidebar.set(false);
				}

				if ($showSidebar && !value) {
					const navElement = document.getElementsByTagName('nav')[0];
					if (navElement) {
						navElement.style['-webkit-app-region'] = 'drag';
					}
				}
			}),
			showSidebar.subscribe(async (value) => {
				localStorage.sidebar = value;

				// nav element is not available on the first render
				const navElement = document.getElementsByTagName('nav')[0];

				if (navElement) {
					if ($mobile) {
						if (!value) {
							navElement.style['-webkit-app-region'] = 'drag';
						} else {
							navElement.style['-webkit-app-region'] = 'no-drag';
						}
					} else {
						navElement.style['-webkit-app-region'] = 'drag';
					}
				}

				if (value) {
					// Only fetch channels if the feature is enabled and user has permission
					if (
						$config?.features?.enable_channels &&
						($user?.role === 'admin' || ($user?.permissions?.features?.channels ?? true))
					) {
						await initChannels();
					}
					await initChatList();

					// Check which chats have active tasks
					const allChatIds = [...$chats.map((c) => c.id), ...$pinnedChats.map((c) => c.id)];
					if (allChatIds.length > 0) {
						try {
							const res = await checkActiveChats(localStorage.token, allChatIds);
							activeChatIds.set(new Set(res.active_chat_ids || []));
						} catch (e) {
							console.debug('Failed to check active chats:', e);
						}
					}
				}
			}),
			settings.subscribe((value) => {
				if (pinnedModels != value?.pinnedModels ?? []) {
					pinnedModels = value?.pinnedModels ?? [];
					showPinnedModels = pinnedModels.length > 0;
				}
			})
		];

		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('keyup', onKeyUp);

		window.addEventListener('touchstart', onTouchStart);
		window.addEventListener('touchend', onTouchEnd);

		window.addEventListener('focus', onFocus);
		window.addEventListener('blur', onBlur);

		const dropZone = document.getElementById('sidebar');
		if (dropZone) {
			dropZone.addEventListener('dragover', onDragOver);
			dropZone.addEventListener('drop', onDrop);
			dropZone.addEventListener('dragleave', onDragLeave);
		}

		const socketInstance = $socket;
		socketInstance?.on('events', chatActiveEventHandler);

		return () => {
			unsubscribers.forEach((unsubscriber) => unsubscriber());

			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('keyup', onKeyUp);

			window.removeEventListener('touchstart', onTouchStart);
			window.removeEventListener('touchend', onTouchEnd);

			window.removeEventListener('focus', onFocus);
			window.removeEventListener('blur', onBlur);

			if (dropZone) {
				dropZone.removeEventListener('dragover', onDragOver);
				dropZone.removeEventListener('drop', onDrop);
				dropZone.removeEventListener('dragleave', onDragLeave);
			}

			socketInstance?.off('events', chatActiveEventHandler);
		};
	});

	// Handler for chat:active events (defined outside onMount for proper cleanup)
	const chatActiveEventHandler = (event: {
		chat_id: string;
		message_id: string;
		data: { type: string; data: any };
	}) => {
		if (event.data?.type === 'chat:active') {
			const { active } = event.data.data;
			activeChatIds.update((ids) => {
				const newSet = new Set(ids);
				if (active) {
					newSet.add(event.chat_id);
				} else {
					newSet.delete(event.chat_id);
				}
				return newSet;
			});
		}
	};

	const newChatHandler = async () => {
		selectedChatId = null;
		selectedFolder.set(null);

		if ($user?.role !== 'admin' && $user?.permissions?.chat?.temporary_enforced) {
			await temporaryChatEnabled.set(true);
		} else {
			await temporaryChatEnabled.set(false);
		}

		setTimeout(() => {
			if ($mobile) {
				showSidebar.set(false);
			}
		}, 0);
	};

	const itemClickHandler = async () => {
		selectedChatId = null;
		chatId.set('');

		if ($mobile) {
			showSidebar.set(false);
		}

		await tick();
	};

	const isWindows = /Windows/i.test(navigator.userAgent);
</script>

<ArchivedChatsModal
	bind:show={$showArchivedChats}
	onUpdate={async () => {
		await initChatList();
	}}
/>

<ChannelModal
	bind:show={showCreateChannel}
	onSubmit={async (payload: any) => {
		let { type, name, is_private, access_grants, group_ids, user_ids } = payload ?? {};
		name = name?.trim();

		if (type === 'dm') {
			if (!user_ids || user_ids.length === 0) {
				toast.error($i18n.t('Please select at least one user for Direct Message channel.'));
				return;
			}
		} else {
			if (!name) {
				toast.error($i18n.t('Channel name cannot be empty.'));
				return;
			}
		}

		const res = await createNewChannel(localStorage.token, {
			type: type,
			name: name,
			is_private: is_private,
			access_grants: access_grants,
			group_ids: group_ids,
			user_ids: user_ids
		}).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (res) {
			$socket.emit('join-channels', { auth: { token: $user?.token } });
			await initChannels();
			showCreateChannel = false;
			showChannels = true;
			goto(`/channels/${res.id}`);
		}
	}}
/>

<FolderModal
	bind:show={showCreateFolderModal}
	onSubmit={async (folder) => {
		await createFolder(folder);
		showCreateFolderModal = false;
	}}
/>

<!-- svelte-ignore a11y-no-static-element-interactions -->

{#if $showSidebar && $mobile}
	<div
		class="fixed z-40 inset-0"
		style="background: rgba(0,0,0,0.7);"
		on:mousedown={() => showSidebar.set(false)}
	/>
{/if}

<SearchModal
	bind:show={$showSearch}
	onClose={() => {
		if ($mobile) {
			showSidebar.set(false);
		}
	}}
/>

<button
	id="sidebar-new-chat-button"
	class="hidden"
	on:click={() => {
		goto('/');
		newChatHandler();
	}}
/>

<svelte:window
	on:mousemove={(e) => {
		if (!isResizing) return;
		resizeSidebarHandler(e.clientX);
	}}
	on:mouseup={() => {
		resizeEndHandler();
	}}
/>

{#if $showSidebar}
<!-- ── Ember Left Sidebar ───────────────────────────── -->
<aside
	bind:this={navElement}
	id="sidebar"
	class="h-screen max-h-[100dvh] flex flex-col relative select-none shrink-0 ember-scrollbar-hidden"
	style="
		width: 260px;
		background: var(--ember-shadow);
		{$mobile ? 'position: fixed; top: 0; left: 0; z-index: 50;' : ''}
	"
	transition:slide={{ duration: 250, axis: 'x' }}
	data-state={$showSidebar}
>
	<!-- Right edge accent stripe -->
	<div class="ember-stripe absolute right-0 top-0 bottom-0 z-10" style="width: 2px;" />

	<!-- ── Header (56px) ── -->
	<div
		class="flex items-center gap-2 px-3 shrink-0"
		style="height: 56px; border-bottom: 1px solid rgba(69,69,69,0.4);"
	>
		<EmberLogo size={24} />
		<span
			style="
				font-family: 'Archivo', sans-serif;
				font-size: 16px;
				font-weight: 600;
				color: var(--ember-text-primary);
				letter-spacing: -0.1px;
			"
		>Ember</span>
		<div class="flex-1" />

		<!-- New Chat button -->
		<a
			href="/"
			draggable="false"
			on:click={newChatHandler}
			class="ember-glow flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
			style="width: 32px; height: 32px;"
			aria-label={$i18n.t('New Chat')}
		>
			<PencilSquare className="size-4.5" strokeWidth="1.5" />
		</a>

		<!-- Search button -->
		<button
			on:click={() => showSearch.set(true)}
			class="flex items-center justify-center rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
			style="width: 32px; height: 32px;"
			aria-label={$i18n.t('Search')}
		>
			<Search className="size-4.5" strokeWidth="1.5" />
		</button>
	</div>

	<!-- ── Pinned Models ── -->
	{#if ($models ?? []).length > 0 && (($settings?.pinnedModels ?? []).length > 0 || $config?.default_pinned_models)}
		<div class="px-[9px] pt-2 shrink-0">
			<PinnedModelList bind:selectedChatId {shiftKey} />
		</div>
	{/if}

	<!-- ── Channels (collapsible, dummy for now) ── -->
	{#if $config?.features?.enable_channels && ($user?.role === 'admin' || ($user?.permissions?.features?.channels ?? true))}
		<div class="px-[9px] pt-2 shrink-0">
			<button
				on:click={() => (showChannels = !showChannels)}
				class="flex items-center gap-1.5 w-full px-1 py-1"
			>
				<!-- Hash icon -->
				<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-tertiary)" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
				<span style="font-size: 11px; letter-spacing: 0.3px; text-transform: uppercase; font-weight: 500; color: var(--ember-text-tertiary);">
					{$i18n.t('Channels')}
				</span>
				<!-- Chevron -->
				{#if showChannels}
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ml-auto" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
				{:else}
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="ml-auto" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>
				{/if}
			</button>

			{#if showChannels}
				<div class="mt-0.5">
					{#each $channels as channel (`channel-${channel.id}`)}
						{@const channelActive = $page.url.pathname === `/channels/${channel.id}`}
						<button
							on:click={() => { goto(`/channels/${channel.id}`); itemClickHandler(); }}
							class="flex items-center gap-2 w-full rounded-md transition-colors hover:bg-[var(--ember-ash)]"
							style="
								height: 36px;
								padding: 0 8px;
								background: {channelActive ? 'var(--ember-stone)' : 'transparent'};
								border-left: 2px solid {channelActive ? 'var(--ember-flame)' : 'transparent'};
							"
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="{channelActive ? 'var(--ember-flame)' : 'var(--ember-text-tertiary)'}" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="9" y2="9"/><line x1="4" x2="20" y1="15" y2="15"/><line x1="10" x2="8" y1="3" y2="21"/><line x1="16" x2="14" y1="3" y2="21"/></svg>
							<span
								class="truncate text-left"
								style="font-size: 13px; color: {channelActive ? 'var(--ember-text-primary)' : 'var(--ember-text-secondary)'};"
							>
								{channel.name}
							</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>
	{/if}

	<!-- ── Chat List (flex-1, scrollable) ── -->
	<div
		class="flex-1 overflow-y-auto ember-scrollbar-hidden px-[9px] pt-2"
		on:scroll={(e) => { scrollTop = e.target.scrollTop; }}
	>
		<!-- Pinned chats -->
		{#if $pinnedChats.length > 0}
			<div style="padding: 4px 12px 6px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.3px; font-weight: 500; color: var(--ember-text-tertiary);">
				{$i18n.t('Pinned')}
			</div>
			{#each $pinnedChats as chat, idx (`pinned-${chat?.id ?? idx}`)}
				{@const chatActive = $chatId === chat.id}
				<button
					on:click={() => { goto(`/c/${chat.id}`); itemClickHandler(); }}
					class="flex items-center gap-2 w-full rounded-md transition-all group"
					style="
						min-height: 36px;
						padding: 4px 9px;
						background: {chatActive ? 'var(--ember-stone)' : 'transparent'};
						border-left: 2px solid {chatActive ? 'var(--ember-flame)' : 'transparent'};
					"
					on:contextmenu={(e) => { e.preventDefault(); selectedChatId = chat.id; }}
				>
					<!-- Pin icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--ember-spark)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" aria-hidden="true"><line x1="12" x2="12" y1="17" y2="22"/><path d="M5 17H19V16a3 3 0 0 0-2.13-.873l-1.44-4.318A4 4 0 0 0 12 7V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v4a4 4 0 0 0-3.43 4.81L5.87 16.13A3 3 0 0 0 5 16v1z"/></svg>
					<span
						class="truncate text-left flex-1"
						style="font-size: 13px; color: {chatActive ? 'var(--ember-text-primary)' : 'var(--ember-text-secondary)'};"
					>
						{chat.title}
					</span>
				</button>
			{/each}
		{/if}

		<!-- Folders -->
		{#if $config?.features?.enable_folders && ($user?.role === 'admin' || ($user?.permissions?.features?.folders ?? true))}
			<Folders
				bind:folderRegistry
				{folders}
				{shiftKey}
				onDelete={(folderId) => { selectedFolder.set(null); initChatList(); }}
				on:update={() => { initChatList(); }}
				on:import={(e) => { const { folderId, items } = e.detail; importChatHandler(items, false, folderId); }}
				on:change={async () => { initChatList(); }}
			/>
		{/if}

		<!-- Regular chat list with date groups -->
		{#if $chats}
			<div class="pt-1.5">
				{#each $chats as chat, idx (`chat-${chat?.id ?? idx}`)}
					{#if idx === 0 || (idx > 0 && chat.time_range !== $chats[idx - 1].time_range)}
						<div
							style="
								padding: {idx === 0 ? '4px' : '20px'} 12px 6px;
								font-size: 11px;
								text-transform: uppercase;
								letter-spacing: 0.3px;
								font-weight: 500;
								color: var(--ember-text-tertiary);
							"
						>
							{$i18n.t(chat.time_range)}
						</div>
					{/if}

					<ChatItem
						className=""
						id={chat.id}
						title={chat.title}
						createdAt={chat.created_at}
						{shiftKey}
						selected={selectedChatId === chat.id}
						on:select={() => { selectedChatId = chat.id; }}
						on:unselect={() => { selectedChatId = null; }}
						on:change={async () => { initChatList(); }}
						on:tag={(e) => { const { type, name } = e.detail; tagEventHandler(type, name, chat.id); }}
					/>
				{/each}

				{#if $scrollPaginationEnabled && !allChatsLoaded}
					<Loader
						on:visible={(e) => {
							if (!chatListLoading) { loadMoreChats(); }
						}}
					>
						<div class="w-full flex justify-center py-1 text-xs animate-pulse items-center gap-2" style="color: var(--ember-text-tertiary);">
							<Spinner className="size-4" />
							<div>{$i18n.t('Loading...')}</div>
						</div>
					</Loader>
				{/if}
			</div>
		{:else}
			<div class="w-full flex justify-center py-2 text-xs animate-pulse items-center gap-2" style="color: var(--ember-text-tertiary);">
				<Spinner className="size-4" />
				<div>{$i18n.t('Loading...')}</div>
			</div>
		{/if}
	</div>

	<!-- ── User Footer (64px) ── -->
	<div
		class="shrink-0 flex items-center gap-3 px-3 relative"
		style="height: 64px; border-top: 1px solid rgba(69,69,69,0.4);"
	>
		{#if $user}
			<UserMenu
				role={$user?.role}
				profile={$config?.features?.enable_user_status ?? true}
				showActiveUsers={false}
				className="max-w-[228px]"
				on:show={(e) => {
					if (e.detail === 'archived-chat') {
						showArchivedChats.set(true);
					}
				}}
			>
				<div class="flex items-center gap-3 flex-1 min-w-0 cursor-pointer rounded-lg px-1 py-1 transition-colors hover:bg-[var(--ember-ash)]">
					<!-- Avatar circle with status dot overlay -->
					<div class="shrink-0 relative">
						<div
							class="flex items-center justify-center rounded-full"
							style="
								width: 32px;
								height: 32px;
								background: var(--ember-ash);
								font-size: 13px;
								font-weight: 500;
								color: var(--ember-text-primary);
							"
						>
							{($user.name ?? 'U')[0].toUpperCase()}
						</div>
						<span
							class="absolute bottom-0 right-0 block rounded-full ring-2 ring-[var(--ember-charcoal)]"
							style="width: 9px; height: 9px; background: {($user?.is_active ?? true) ? '#22c55e' : '#6b7280'};"
						/>
					</div>
					<!-- Name -->
					<div class="flex-1 min-w-0 flex items-center">
						<div
							class="truncate"
							style="font-size: 13px; font-weight: 500; color: var(--ember-text-primary);"
						>
							{$user.name}
						</div>
					</div>
					<!-- MoreHorizontal icon -->
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ember-text-tertiary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="shrink-0" aria-hidden="true"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
				</div>
			</UserMenu>
		{/if}
	</div>
</aside>
{/if}
