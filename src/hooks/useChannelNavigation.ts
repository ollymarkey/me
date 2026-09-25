import { useCallback, useEffect, useRef, useState } from 'react';
import { getChannel } from '../data/channels';

export function useChannelNavigation(onChange: (id: string) => void) {
	const [channelId, setChannelId] = useState('welcome');
	const currentChannel = useRef('welcome');

	const navigate = useCallback(
		(id: string) => {
			if (!getChannel(id) || currentChannel.current === id) return;
			onChange(id);
			currentChannel.current = id;
			setChannelId(id);
		},
		[onChange],
	);

	useEffect(() => {
		function syncHash() {
			const id = window.location.hash.slice(1);
			if (id !== 'main-content') navigate(getChannel(id) ? id : 'welcome');
		}

		syncHash();
		window.addEventListener('hashchange', syncHash);
		return () => window.removeEventListener('hashchange', syncHash);
	}, [navigate]);

	return { channel: getChannel(channelId)!, navigate };
}
