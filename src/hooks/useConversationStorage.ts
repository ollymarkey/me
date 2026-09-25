import { useEffect, useState, type Dispatch } from 'react';
import { restoreHistories, STORAGE_KEY, type Action } from '../lib/chat/reducer';
import type { Histories } from '../lib/chat/types';

export function useConversationStorage(histories: Histories, dispatch: Dispatch<Action>) {
	const [ready, setReady] = useState(false);
	const [storageNotice, setStorageNotice] = useState(false);

	useEffect(() => {
		try {
			const histories = restoreHistories(sessionStorage.getItem(STORAGE_KEY));
			dispatch({ type: 'restore', histories });
		} catch {
			setStorageNotice(true);
		}
		setReady(true);
	}, [dispatch]);

	useEffect(() => {
		if (!ready) return;
		const timer = setTimeout(() => {
			try {
				sessionStorage.setItem(STORAGE_KEY, JSON.stringify(histories));
			} catch {
				setStorageNotice(true);
			}
		}, 180);
		return () => clearTimeout(timer);
	}, [histories, ready]);

	return { ready, storageNotice };
}
