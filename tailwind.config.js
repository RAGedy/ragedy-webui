import typography from '@tailwindcss/typography';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'ember-void': 'var(--ember-void)',
				'ember-shadow': 'var(--ember-shadow)',
				'ember-charcoal': 'var(--ember-charcoal)',
				'ember-graphite': 'var(--ember-graphite)',
				'ember-stone': 'var(--ember-stone)',
				'ember-ash': 'var(--ember-ash)',
				'ember-cinder': 'var(--ember-cinder)',
				'ember-flame': 'var(--ember-flame)',
				'ember-glow-color': 'var(--ember-glow)',
				'ember-spark': 'var(--ember-spark)',
				'ember-flare': 'var(--ember-flare)',
				'ember-ember': 'var(--ember-ember)',
				'ember-text-primary': 'var(--ember-text-primary)',
				'ember-text-secondary': 'var(--ember-text-secondary)',
				'ember-text-tertiary': 'var(--ember-text-tertiary)',
				'ember-success': 'var(--ember-success)',
				'ember-warning': 'var(--ember-warning)',
				'ember-error': 'var(--ember-error)',
			},
			typography: {
				DEFAULT: {
					css: {
						pre: false,
						code: false,
						'pre code': false,
						'code::before': false,
						'code::after': false
					}
				}
			},
			padding: {
				'safe-bottom': 'env(safe-area-inset-bottom)'
			},
			transitionProperty: {
				width: 'width'
			}
		}
	},
	plugins: [typography, containerQueries]
};
