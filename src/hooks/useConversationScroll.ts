import { useLayoutEffect, useRef, useState } from 'react';
import type { Histories } from '../lib/chat/types';

export function useConversationScroll(channelId: string, histories: Histories) {
	const scrollRef = useRef<HTMLDivElement>(null);
	const positions = useRef<Record<string, number>>({});
	const bottomRef = useRef(true);
	const [nearBottom, setNearBottom] = useState(true);

	function onScroll() {
		const pane = scrollRef.current;
		if (!pane) return;
		positions.current[channelId] = pane.scrollTop;
		bottomRef.current = pane.scrollHeight - pane.scrollTop - pane.clientHeight < 90;
		setNearBottom(bottomRef.current);
	}

	useLayoutEffect(() => {
		const pane = scrollRef.current;
		if (!pane) return;
		pane.scrollTop = positions.current[channelId] ?? 0;
		bottomRef.current = pane.scrollHeight - pane.scrollTop - pane.clientHeight < 90;
		setNearBottom(bottomRef.current);
	}, [channelId]);

	useLayoutEffect(() => {
		if (bottomRef.current && scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [histories]);

	function followLatest() {
		bottomRef.current = true;
		setNearBottom(true);
	}

	function jumpToLatest() {
		followLatest();
		const pane = scrollRef.current;
		pane?.scrollTo({ top: pane.scrollHeight, behavior: 'instant' });
	}

	function scrollToExchange(promptId: string) {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		document.getElementById(`exchange-${promptId}`)?.scrollIntoView({
			block: 'start',
			behavior: reducedMotion ? 'instant' : 'smooth',
		});
	}

	return { scrollRef, nearBottom, onScroll, followLatest, jumpToLatest, scrollToExchange };
}
