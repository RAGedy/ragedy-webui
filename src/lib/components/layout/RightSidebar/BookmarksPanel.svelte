<script lang="ts">
	import { getContext, tick } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { i18n as i18nType } from 'i18next';
	import { toast } from 'svelte-sonner';

	import {
		bookmarksRefreshToken,
		chatId,
		user
	} from '$lib/stores';
	import { getChatById, updateChatById } from '$lib/apis/chats';
	import {
		convertMessagesToHistory,
		createMessagesList,
		removeAllDetails
	} from '$lib/utils';

	import Modal from '$lib/components/common/Modal.svelte';
	import Messages from '$lib/components/chat/Messages.svelte';
	import Tooltip from '$lib/components/common/Tooltip.svelte';
	import BookmarkSlash from '$lib/components/icons/BookmarkSlash.svelte';
	import Pencil from '$lib/components/icons/Pencil.svelte';
	import Pin from '$lib/components/icons/Pin.svelte';
	import PinSlash from '$lib/components/icons/PinSlash.svelte';
	import XMark from '$lib/components/icons/XMark.svelte';

	const i18n = getContext<Writable<i18nType>>('i18n');

	const DEFAULT_BOOKMARK_TITLE = 'New bookmark';

	type BookmarkMeta = {
		title: string;
		pinned: boolean;
		createdAt: number;
		updatedAt: number;
	};

	type BookmarkItem = {
		messageId: string;
		title: string;
		pinned: boolean;
		updatedAt: number;
		preview: string;
		role: string;
	};

	let loading = false;
	let chatData: any = null;
	let bookmarks: BookmarkItem[] = [];

	let editingMessageId: string | null = null;
	let editedTitle = '';

	let showHistoryModal = false;
	let previewHistory: any = null;
	let previewSelectedModels = [''];
	let previewTargetMessageId: string | null = null;

	let lastRefreshKey = '';

	const parseSelectedModels = (chat: any): string[] => {
		const models = chat?.chat?.models;
		if (Array.isArray(models)) {
			return models;
		}
		if (typeof models === 'string' && models.length > 0) {
			return [models];
		}
		return [''];
	};

	const getHistoryFromChatData = (chat: any) => {
		if (!chat?.chat) {
			return null;
		}

		if (chat.chat.history) {
			return structuredClone(chat.chat.history);
		}

		if (Array.isArray(chat.chat.messages)) {
			return convertMessagesToHistory(chat.chat.messages);
		}

		return {
			messages: {},
			currentId: null
		};
	};

	const normalizePreviewText = (content: any): string => {
		if (typeof content === 'string') {
			const text = removeAllDetails(content).replace(/\s+/g, ' ').trim();
			return text || $i18n.t('No text content');
		}

		if (Array.isArray(content)) {
			const text = content
				.map((part) => {
					if (typeof part === 'string') {
						return part;
					}
					if (typeof part?.text === 'string') {
						return part.text;
					}
					return '';
				})
				.join(' ')
				.replace(/\s+/g, ' ')
				.trim();
			return text || $i18n.t('Non-text content');
		}

		return $i18n.t('Non-text content');
	};

	const buildBookmarks = (history: any): BookmarkItem[] => {
		if (!history?.messages) {
			return [];
		}

		const items = Object.values(history.messages)
			.filter((message: any) => {
				return (
					message?.bookmark &&
					(message.role === 'user' || message.role === 'assistant')
				);
			})
			.map((message: any) => {
				const bookmark = message.bookmark ?? {};
				const updatedAt =
					typeof bookmark.updatedAt === 'number'
						? bookmark.updatedAt
						: (message.timestamp ?? 0) * 1000;

				return {
					messageId: message.id,
					title:
						typeof bookmark.title === 'string' && bookmark.title.trim().length > 0
							? bookmark.title
							: DEFAULT_BOOKMARK_TITLE,
					pinned: Boolean(bookmark.pinned),
					updatedAt,
					preview: normalizePreviewText(message.content),
					role: message.role
				};
			});

		return items.sort((a, b) => {
			if (a.pinned !== b.pinned) {
				return Number(b.pinned) - Number(a.pinned);
			}
			return b.updatedAt - a.updatedAt;
		});
	};

	const refreshChat = async () => {
		if (!$chatId || $chatId.startsWith('local:')) {
			chatData = null;
			bookmarks = [];
			return;
		}

		loading = true;
		const chat = await getChatById(localStorage.token, $chatId).catch((error) => {
			console.error('Failed to load chat for bookmarks', error);
			return null;
		});
		loading = false;

		if (!chat?.chat) {
			chatData = null;
			bookmarks = [];
			return;
		}

		chatData = chat;
		const history = getHistoryFromChatData(chatData);
		bookmarks = buildBookmarks(history);
	};

	const createBookmarkMeta = (
		current: BookmarkMeta | null,
		overrides: Partial<BookmarkMeta> = {}
	): BookmarkMeta => {
		const now = Date.now();
		return {
			title: current?.title ?? DEFAULT_BOOKMARK_TITLE,
			pinned: current?.pinned ?? false,
			createdAt: current?.createdAt ?? now,
			updatedAt: now,
			...overrides
		};
	};

	const persistHistory = async (history: any) => {
		if (!$chatId || $chatId.startsWith('local:') || !chatData?.chat) {
			return false;
		}

		const nextPayload = {
			...chatData.chat,
			history,
			messages: createMessagesList(history, history.currentId)
		};

		const updated = await updateChatById(localStorage.token, $chatId, nextPayload).catch((error) => {
			toast.error(`${error}`);
			return null;
		});

		if (!updated?.chat) {
			return false;
		}

		chatData = updated;
		bookmarks = buildBookmarks(getHistoryFromChatData(chatData));
		bookmarksRefreshToken.update((count) => count + 1);
		return true;
	};

	const withMutableBookmark = async (
		messageId: string,
		updater: (bookmark: BookmarkMeta | null) => BookmarkMeta | null
	) => {
		const history = getHistoryFromChatData(chatData);
		if (!history?.messages?.[messageId]) {
			await refreshChat();
			return;
		}

		const message = history.messages[messageId];
		const nextBookmark = updater(message.bookmark ?? null);
		if (nextBookmark) {
			message.bookmark = nextBookmark;
		} else {
			delete message.bookmark;
		}

		await persistHistory(history);
	};

	const startRename = (item: BookmarkItem) => {
		editingMessageId = item.messageId;
		editedTitle = item.title;
	};

	const cancelRename = () => {
		editingMessageId = null;
		editedTitle = '';
	};

	const saveRename = async (messageId: string) => {
		const normalizedTitle = (editedTitle ?? '').trim() || DEFAULT_BOOKMARK_TITLE;

		await withMutableBookmark(messageId, (bookmark) => {
			if (!bookmark) {
				return null;
			}

			return createBookmarkMeta(bookmark, { title: normalizedTitle });
		});

		cancelRename();
	};

	const togglePinned = async (messageId: string) => {
		await withMutableBookmark(messageId, (bookmark) => {
			if (!bookmark) {
				return null;
			}
			return createBookmarkMeta(bookmark, { pinned: !bookmark.pinned });
		});
	};

	const unbookmark = async (messageId: string) => {
		await withMutableBookmark(messageId, () => null);
	};

	const setCurrentIdToBranchTail = (history: any, messageId: string) => {
		let currentId = messageId;
		let childrenIds = history.messages[currentId]?.childrenIds ?? [];

		while (childrenIds.length !== 0) {
			currentId = childrenIds.at(-1);
			childrenIds = history.messages[currentId]?.childrenIds ?? [];
		}

		history.currentId = currentId;
	};

	const scrollToPreviewMessage = async () => {
		if (!previewTargetMessageId) {
			return;
		}

		await tick();
		const messageElement = document.getElementById(`message-${previewTargetMessageId}`);
		if (messageElement) {
			messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
		}
	};

	const openHistoryPreview = async (item: BookmarkItem) => {
		const history = getHistoryFromChatData(chatData);
		if (!history?.messages?.[item.messageId]) {
			await refreshChat();
			return;
		}

		setCurrentIdToBranchTail(history, item.messageId);

		previewHistory = history;
		previewSelectedModels = parseSelectedModels(chatData);
		previewTargetMessageId = item.messageId;

		showHistoryModal = true;
		await scrollToPreviewMessage();
	};

	$: {
		const refreshKey = `${$chatId}:${$bookmarksRefreshToken}`;
		if (refreshKey !== lastRefreshKey) {
			lastRefreshKey = refreshKey;
			refreshChat();
		}
	}
</script>

<Modal size="xl" bind:show={showHistoryModal}>
	<div class="px-4 py-3">
		<div class="flex items-center justify-between pb-2">
			<div
				style="font-size: 15px; font-weight: 600; color: var(--ember-text-primary);"
			>
				{$i18n.t('Bookmarked Message Context')}
			</div>
			<button
				type="button"
				class="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ember-ash)]"
				style="width: 28px; height: 28px; color: var(--ember-text-tertiary);"
				on:click={() => {
					showHistoryModal = false;
				}}
				aria-label={$i18n.t('Close')}
			>
				<XMark className="size-4" strokeWidth="1.6" />
			</button>
		</div>

		<div class="h-[65vh] overflow-y-auto ember-scrollbar-hidden" id="bookmarks-history-preview">
			{#if previewHistory}
				<Messages
					className="h-full flex pt-4 pb-8 w-full"
					chatId={`bookmark-preview-${$chatId}`}
					user={$user}
					readOnly={true}
					prompt={null}
					selectedModels={previewSelectedModels}
					atSelectedModel={null}
					bind:history={previewHistory}
					autoScroll={false}
					sendMessage={() => {}}
					continueResponse={() => {}}
					regenerateResponse={() => {}}
					mergeResponses={() => {}}
					chatActionHandler={() => {}}
				/>
			{/if}
		</div>
	</div>
</Modal>

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

	{#if !$chatId}
		<div
			class="mt-3"
			style="font-size: 12px; color: var(--ember-text-tertiary);"
		>
			{$i18n.t('Open a chat to view bookmarks.')}
		</div>
	{:else if $chatId.startsWith('local:')}
		<div
			class="mt-3"
			style="font-size: 12px; color: var(--ember-text-tertiary);"
		>
			{$i18n.t('Bookmarks are unavailable for temporary chats.')}
		</div>
	{:else if loading && bookmarks.length === 0}
		<div
			class="mt-3"
			style="font-size: 12px; color: var(--ember-text-tertiary);"
		>
			{$i18n.t('Loading bookmarks...')}
		</div>
	{:else if bookmarks.length === 0}
		<div
			class="mt-3"
			style="font-size: 12px; color: var(--ember-text-tertiary);"
		>
			{$i18n.t('No bookmarks yet.')}
		</div>
	{:else}
		<div class="mt-2 flex flex-col gap-2">
			{#each bookmarks as item (item.messageId)}
				<Tooltip content={item.preview} placement="left">
					<div
						class="rounded-md px-2.5 py-2 transition-colors hover:bg-[var(--ember-ash)] cursor-pointer"
						on:click={() => {
							openHistoryPreview(item);
						}}
						role="button"
						tabindex="0"
						on:keydown={(event) => {
							if (event.key === 'Enter' || event.key === ' ') {
								event.preventDefault();
								openHistoryPreview(item);
							}
						}}
					>
						<div class="flex items-start gap-2">
							<div class="flex-1 min-w-0">
								{#if editingMessageId === item.messageId}
									<input
										class="w-full rounded-md px-2 py-1 outline-none"
										style="
											background: var(--ember-stone);
											border: 1px solid rgba(69,69,69,0.75);
											color: var(--ember-text-primary);
											font-size: 12px;
										"
										bind:value={editedTitle}
										on:click|stopPropagation
										on:blur={() => {
											saveRename(item.messageId);
										}}
										on:keydown={(event) => {
											if (event.key === 'Enter') {
												event.preventDefault();
												saveRename(item.messageId);
											}
											if (event.key === 'Escape') {
												event.preventDefault();
												cancelRename();
											}
										}}
									/>
								{:else}
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
								{/if}

								<div
									class="line-clamp-2 mt-1"
									style="
										font-size: 12px;
										color: var(--ember-text-tertiary);
									"
								>
									{item.preview}
								</div>
							</div>

							<div class="flex items-center gap-0.5">
								<Tooltip content={$i18n.t('Rename')} placement="bottom">
									<button
										type="button"
										class="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ember-stone)]"
										style="width: 24px; height: 24px; color: var(--ember-text-tertiary);"
										aria-label={$i18n.t('Rename')}
										on:click|stopPropagation={() => {
											startRename(item);
										}}
									>
										<Pencil className="size-3.5" strokeWidth="1.8" />
									</button>
								</Tooltip>

								<Tooltip
									content={item.pinned ? $i18n.t('Unpin') : $i18n.t('Pin')}
									placement="bottom"
								>
									<button
										type="button"
										class="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ember-stone)]"
										style="width: 24px; height: 24px; color: var(--ember-text-tertiary);"
										aria-label={item.pinned ? $i18n.t('Unpin') : $i18n.t('Pin')}
										on:click|stopPropagation={() => {
											togglePinned(item.messageId);
										}}
									>
										{#if item.pinned}
											<PinSlash className="size-3.5" strokeWidth="1.7" />
										{:else}
											<Pin className="size-3.5" strokeWidth="1.7" />
										{/if}
									</button>
								</Tooltip>

								<Tooltip content={$i18n.t('Unbookmark')} placement="bottom">
									<button
										type="button"
										class="flex items-center justify-center rounded-md transition-colors hover:bg-[var(--ember-stone)]"
										style="width: 24px; height: 24px; color: var(--ember-text-tertiary);"
										aria-label={$i18n.t('Unbookmark')}
										on:click|stopPropagation={() => {
											unbookmark(item.messageId);
										}}
									>
										<BookmarkSlash className="size-3.5" strokeWidth="1.7" />
									</button>
								</Tooltip>
							</div>
						</div>
					</div>
				</Tooltip>
			{/each}
		</div>
	{/if}
</div>
