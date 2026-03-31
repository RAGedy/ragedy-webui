<script lang="ts">
	type AgentOption = {
		id: string;
		name: string;
		description: string;
	};

	const mockAgents: AgentOption[] = [
		{
			id: 'research-assistant',
			name: 'Research Assistant',
			description: 'Summarizes and organizes source material.'
		},
		{
			id: 'qa-reviewer',
			name: 'QA Reviewer',
			description: 'Checks outputs for gaps and consistency.'
		},
		{
			id: 'planning-analyst',
			name: 'Planning Analyst',
			description: 'Builds structured execution plans.'
		},
		{
			id: 'support-helper',
			name: 'Support Helper',
			description: 'Drafts response and triage suggestions.'
		}
	];

	let selectedAgentId = mockAgents[0].id;
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
		Agent Builder
	</div>

	<div class="mt-3">
		<div
			style="
				font-size: 12px;
				font-weight: 500;
				color: var(--ember-text-secondary);
			"
		>
			Agents
		</div>
		<div
			class="mt-2 max-h-44 overflow-y-auto ember-scrollbar-hidden flex flex-col gap-1 pr-1"
		>
			{#each mockAgents as agent}
				<button
					type="button"
					class="w-full rounded-md px-2.5 py-2 text-left transition-colors"
					style="
						background: {selectedAgentId === agent.id ? 'var(--ember-ash)' : 'transparent'};
						color: var(--ember-text-secondary);
					"
					on:click={() => {
						selectedAgentId = agent.id;
					}}
				>
					<div
						style="
							font-size: 13px;
							color: var(--ember-text-primary);
							font-weight: 500;
						"
					>
						{agent.name}
					</div>
					<div
						style="
							font-size: 12px;
							color: var(--ember-text-tertiary);
							margin-top: 2px;
						"
					>
						{agent.description}
					</div>
				</button>
			{/each}
		</div>

		<button
			type="button"
			class="w-full mt-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--ember-ash)]"
			style="
				background: var(--ember-stone);
				border: 1px solid rgba(69,69,69,0.8);
				color: var(--ember-text-primary);
			"
		>
			Create Agent
		</button>
	</div>
</div>
