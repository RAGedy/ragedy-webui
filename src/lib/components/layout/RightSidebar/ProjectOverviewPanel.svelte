<script lang="ts">
	let notes = '';

	const activeUsers = ['AL', 'MK', 'JP', 'RT'];
</script>

<div class="px-3 py-3">
	<div
		class="pb-3"
		style="border-bottom: 1px solid rgba(69,69,69,0.45);"
	>
		<div
			style="
				font-size: 15px;
				font-weight: 600;
				color: var(--ember-text-primary);
				margin-top: 0px;
			"
		>
			RAGedy Ann
		</div>
		<p
			style="
				font-size: 13px;
				color: var(--ember-text-secondary);
				margin-top: 6px;
				line-height: 1.45;
			"
		>
			RAG-based intelligence layer designed for VC and private equity workflows, enabling users to interact with, synthesize, and extract insights from large collections of documents through a chat-driven interface. It addresses knowledge burial, onboarding friction, and fragmented information access by combining contextual file management, user-defined metadata, and AI-powered analysis.
		</p>
	</div>

	<div
		class="py-3"
		style="border-bottom: 1px solid rgba(69,69,69,0.45);"
	>
		<div
			style="
				font-size: 12px;
				font-weight: 500;
				color: var(--ember-text-secondary);
			"
		>
			Active Users
		</div>
		<div class="flex items-center mt-2 -space-x-2">
			{#each activeUsers as userInitials}
				<div
					class="size-8 rounded-full flex items-center justify-center"
					style="
						background: var(--ember-ash);
						border: 1px solid rgba(69,69,69,0.6);
						color: var(--ember-text-secondary);
						font-size: 11px;
						font-weight: 600;
					"
				>
					{userInitials}
				</div>
			{/each}
		</div>
		<div
			style="
				font-size: 12px;
				color: var(--ember-text-tertiary);
				margin-top: 8px;
			"
		>
			4 active users
		</div>
	</div>

	<!-- <div
		class="py-3"
		style="border-bottom: 1px solid rgba(69,69,69,0.45);"
	>
		<div
			style="
				font-size: 12px;
				font-weight: 500;
				color: var(--ember-text-secondary);
			"
		>
			Document Context
		</div>
		<div class="mt-2 flex items-center gap-2">
			<span
				class="size-2 rounded-full"
				style="background: var(--ember-flame);"
				aria-hidden="true"
			></span>
			<span
				style="
					font-size: 12px;
					color: var(--ember-text-secondary);
				"
			>
				12 documents indexed
			</span>
		</div>
	</div> -->

	<div class="pt-3">
		<label
			for="project-overview-notes"
			style="
				font-size: 12px;
				font-weight: 500;
				color: var(--ember-text-secondary);
			"
		>
			Notes
		</label>
		<textarea
			id="project-overview-notes"
			bind:value={notes}
			rows="6"
			placeholder="Add quick project notes..."
			class="w-full rounded-lg resize-vertical mt-2 px-3 py-2 outline-none"
			style="
				background: var(--ember-stone);
				border: 1px solid transparent;
				color: var(--ember-text-primary);
				font-size: 13px;
				line-height: 1.4;
			"
		></textarea>
	</div>
</div>
