import { useCallback, useEffect, useRef, useState } from 'react';
import { getChannel, type Channel } from '../data/channels';

export function useChannelNavigation(channels: Channel[], onChange: (id: string) => void) {
	const [channelId, setChannelId] = useState('welcome');
	const currentChannel = useRef('welcome');

	const navigate = useCallback(
		(id: string) => {
			if (!getChannel(channels, id) || currentChannel.current === id) return;
			onChange(id);
			currentChannel.current = id;
			setChannelId(id);
		},
		[channels, onChange],
	);

	useEffect(() => {
		function syncHash() {
			const id = window.location.hash.slice(1);
			if (id !== 'main-content') navigate(getChannel(channels, id) ? id : 'welcome');
		}

		syncHash();
		window.addEventListener('hashchange', syncHash);
		return () => window.removeEventListener('hashchange', syncHash);
	}, [channels, navigate]);

	return { channel: getChannel(channels, channelId)!, navigate };
}
