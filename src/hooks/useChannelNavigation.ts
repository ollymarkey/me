import { useCallback, useEffect, useRef, useState } from 'react';
import { getChannel, type Channel } from '../data/channels';

export function useChannelNavigation(channels: Channel[], onChange: (id: string) => void, initialChannel: string) {
	const [channelId, setChannelId] = useState(initialChannel);
	const currentChannel = useRef(initialChannel);

	const navigate = useCallback(
		(id: string, push = true) => {
			if (push && getChannel(channels, id)) {
				const path = id === 'welcome' ? '/' : `/${id}`;
				if (window.location.pathname !== path || window.location.hash) window.history.pushState(null, '', path);
			}
			if (!getChannel(channels, id) || currentChannel.current === id) return;
			onChange(id);
			currentChannel.current = id;
			setChannelId(id);
		},
		[channels, onChange],
	);

	useEffect(() => {
		function syncLocation() {
			const id = window.location.hash.slice(1);
			if (getChannel(channels, id)) {
				window.history.replaceState(null, '', id === 'welcome' ? '/' : `/${id}`);
				navigate(id, false);
				return;
			}
			const route = window.location.pathname.replace(/^\/|\/$/g, '') || 'welcome';
			if (getChannel(channels, route)) navigate(route, false);
		}
		function handleLink(event: MouseEvent) {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const link = (event.target as Element).closest<HTMLAnchorElement>('a[href]');
			if (!link || link.target || link.hasAttribute('download')) return;
			const url = new URL(link.href);
			const id = url.pathname.replace(/^\/|\/$/g, '') || 'welcome';
			if (url.origin !== location.origin || url.hash || url.search || !getChannel(channels, id)) return;
			event.preventDefault();
			navigate(id);
		}
		syncLocation();
		window.addEventListener('hashchange', syncLocation);
		window.addEventListener('popstate', syncLocation);
		document.addEventListener('click', handleLink);
		return () => {
			window.removeEventListener('hashchange', syncLocation);
			window.removeEventListener('popstate', syncLocation);
			document.removeEventListener('click', handleLink);
		};
	}, [channels, navigate]);

	return { channel: getChannel(channels, channelId)!, navigate };
}
