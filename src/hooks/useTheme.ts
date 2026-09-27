import { useEffect, useState } from 'react';

const THEME_KEY = 'olly-theme';

export function useTheme() {
	const [dark, setDark] = useState(false);

	useEffect(() => {
		const media = window.matchMedia('(prefers-color-scheme: dark)');
		function syncTheme() {
			let preference: string | null = null;
			try {
				preference = localStorage.getItem(THEME_KEY);
			} catch {
				// System preference works without storage.
			}
			const isDark = preference ? preference === 'dark' : media.matches;
			setDark(isDark);
			document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
		}

		syncTheme();
		media.addEventListener('change', syncTheme);
		return () => media.removeEventListener('change', syncTheme);
	}, []);

	function toggleTheme() {
		const next = !dark;
		setDark(next);
		document.documentElement.dataset.theme = next ? 'dark' : 'light';
		try {
			localStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
		} catch {
			// The selected theme still applies for this visit.
		}
	}

	return { dark, toggleTheme };
}
