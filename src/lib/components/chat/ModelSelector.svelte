<script lang="ts">
	import { models, showSettings, settings, user, mobile, config } from '$lib/stores';
	import { onMount, tick, getContext } from 'svelte';
	import { toast } from 'svelte-sonner';
	import Selector from './ModelSelector/Selector.svelte';
	import Tooltip from '../common/Tooltip.svelte';

	import { updateUserSettings } from '$lib/apis/users';
	const i18n = getContext('i18n');

	export let selectedModels = [''];
	export let disabled = false;

	export let showSetDefault = true;

	const saveDefaultModel = async () => {
		const hasEmptyModel = selectedModels.filter((it) => it === '');
		if (hasEmptyModel.length) {
			toast.error($i18n.t('Choose a model before saving...'));
			return;
		}
		settings.set({ ...$settings, models: selectedModels });
		await updateUserSettings(localStorage.token, { ui: $settings });

		toast.success($i18n.t('Default model updated'));
	};

	const pinModelHandler = async (modelId) => {
		let pinnedModels = $settings?.pinnedModels ?? [];

		if (pinnedModels.includes(modelId)) {
			pinnedModels = pinnedModels.filter((id) => id !== modelId);
		} else {
			pinnedModels = [...new Set([...pinnedModels, modelId])];
		}

		settings.set({ ...$settings, pinnedModels: pinnedModels });
		await updateUserSettings(localStorage.token, { ui: $settings });
	};

	$: if (selectedModels.length > 0 && $models.length > 0) {
		const _selectedModels = selectedModels.map((model) =>
			$models.map((m) => m.id).includes(model) ? model : ''
		);

		if (JSON.stringify(_selectedModels) !== JSON.stringify(selectedModels)) {
			selectedModels = _selectedModels;
		}
	}
</script>

<div class="flex flex-row items-center gap-1.5">
	{#each selectedModels as selectedModel, selectedModelIdx}
		<div
			class="ember-glow-subtle flex items-center gap-1.5 px-2.5 rounded-lg transition-colors hover:bg-[var(--ember-ash)]"
			style="
				height: 36px;
				min-width: 140px;
				background: var(--ember-stone);
				border: 1px solid transparent;
				border-radius: 8px;
			"
		>
			<div class="overflow-hidden flex-1 min-w-0">
				<Selector
					id={`${selectedModelIdx}`}
					placeholder={$i18n.t('Select a model')}
					items={$models.map((model) => ({
						value: model.id,
						label: model.name,
						model: model
					}))}
					{pinModelHandler}
					bind:value={selectedModel}
				/>
			</div>

			{#if $user?.role === 'admin' || ($user?.permissions?.chat?.multiple_models ?? true)}
				{#if selectedModelIdx === 0}
					<Tooltip content={$i18n.t('Add Model')}>
						<button
							class="flex items-center justify-center shrink-0 rounded transition-colors hover:bg-[var(--ember-ash)] disabled:opacity-40"
							style="width: 20px; height: 20px;"
							disabled={disabled || selectedModels.length >= 3}
							on:click={() => {
								selectedModels = [...selectedModels, ''];
							}}
							aria-label="Add Model"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="size-3.5"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m6-6H6" />
							</svg>
						</button>
					</Tooltip>
				{:else}
					<Tooltip content={$i18n.t('Remove Model')}>
						<button
							class="flex items-center justify-center shrink-0 rounded transition-colors hover:bg-[var(--ember-ash)] disabled:opacity-40"
							style="width: 20px; height: 20px;"
							{disabled}
							on:click={() => {
								selectedModels.splice(selectedModelIdx, 1);
								selectedModels = selectedModels;
							}}
							aria-label="Remove Model"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke-width="2"
								stroke="currentColor"
								class="size-3"
							>
								<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
							</svg>
						</button>
					</Tooltip>
				{/if}
			{/if}
		</div>
	{/each}

	{#if showSetDefault}
		<button
			class="shrink-0 text-[0.65rem] transition-colors"
			style="color: var(--ember-text-tertiary);"
			on:click={saveDefaultModel}
		>
			{$i18n.t('Set as default')}
		</button>
	{/if}
</div>
