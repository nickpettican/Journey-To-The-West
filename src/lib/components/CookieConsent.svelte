<script lang="ts">
	import { onMount } from 'svelte';
	import { base } from '$app/paths';
	import { loadAnalytics } from '$lib/analytics';

	// same key and behaviour as offering-bowl's CookieConsent.vue
	const CONSENT_KEY = 'cookieConsent';
	let show = $state(false);

	const read = () => {
		try {
			return localStorage.getItem(CONSENT_KEY);
		} catch {
			return null;
		}
	};
	const save = (v: string) => {
		try {
			localStorage.setItem(CONSENT_KEY, v);
		} catch {
			/* private mode: the choice just won't persist */
		}
	};

	onMount(() => {
		const choice = read();
		// restore a prior "accepted"; "declined" stays silent; no choice shows the banner
		if (choice === 'accepted') loadAnalytics();
		else if (choice !== 'declined') show = true;
	});

	const accept = () => {
		save('accepted');
		show = false;
		loadAnalytics();
	};

	const decline = () => {
		save('declined');
		show = false;
	};
</script>

{#if show}
	<div class="cookie-consent" role="region" aria-label="Cookie consent">
		<p>
			We use a few cookies to see how the site is used and make it better. They are only set if
			you agree, and the site works the same either way.
			<a href="{base}/about/#cookies">Learn more</a>
		</p>
		<div class="actions">
			<button class="decline" onclick={decline}>Decline</button>
			<button class="accept" onclick={accept}>Accept</button>
		</div>
	</div>
{/if}

<style>
	.cookie-consent {
		position: fixed;
		left: 50%;
		bottom: var(--space-3);
		transform: translateX(-50%);
		z-index: 1000;
		width: min(36rem, calc(100% - 2rem));
		padding: var(--space-3);
		background: var(--paper-card);
		color: var(--ink);
		border: 1px solid var(--paper-deep);
		border-radius: var(--radius-lg);
		box-shadow: var(--shadow-panel);
		font-family: var(--font-ui);
		font-size: 0.9rem;
		text-align: center;
	}

	p {
		margin: 0 0 var(--space-3);
		line-height: 1.5;
	}

	a {
		color: var(--maroon);
		text-decoration: underline;
	}

	.actions {
		display: flex;
		justify-content: center;
		gap: var(--space-3);
	}

	button {
		font: inherit;
		font-weight: 500;
		padding: var(--space-2) var(--space-4);
		border-radius: var(--radius);
		border: none;
		cursor: pointer;
		transition: background var(--transition);
	}

	.decline {
		background: transparent;
		color: var(--ink-soft);
	}

	.decline:hover {
		background: var(--paper-deep);
	}

	.accept {
		background: var(--saffron);
		color: var(--ink);
	}

	.accept:hover {
		background: var(--ochre);
	}

	button:focus-visible {
		outline: 2px solid var(--maroon);
		outline-offset: 2px;
	}
</style>
