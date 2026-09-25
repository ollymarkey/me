import { useCallback, useState } from 'react';
import type { Channel, Prompt } from '../../data/channels';
import { useChannelNavigation } from '../../hooks/useChannelNavigation';
import { useConversationScroll } from '../../hooks/useConversationScroll';
import { useTheme } from '../../hooks/useTheme';
import { useWorkspaceChat } from '../../hooks/useWorkspaceChat';
import ChannelHeader from './ChannelHeader';
import ChannelSidebar from './ChannelSidebar';
import ContextPanel from './ContextPanel';
import Conversation from './Conversation';
import MobileChannelDrawer from './MobileChannelDrawer';
import PromptPicker from './PromptPicker';
import WorkspaceTopbar from './WorkspaceTopbar';

export default function Workspace({ channels }: { channels: Channel[] }) {
	const [announcement, announce] = useState('');
	const chat = useWorkspaceChat(channels, announce);
	const { stop } = chat;
	const { dark, toggleTheme } = useTheme();
	const onChannelChange = useCallback(
		(id: string) => {
			stop();
			announce(`${id} channel selected.`);
		},
		[stop],
	);
	const { channel, navigate } = useChannelNavigation(channels, onChannelChange);
	const scroll = useConversationScroll(channel.id, chat.histories);
	const history = chat.histories[channel.id] ?? [];
	const running = history.some(
		(item) => item.status === 'connecting' || item.status === 'streaming',
	);

	function handleAsk(prompt: Prompt) {
		if (running || !chat.ready) return;
		if (history.some((item) => item.promptId === prompt.id)) {
			scroll.scrollToExchange(prompt.id);
			return;
		}
		scroll.followLatest();
		void chat.ask(channel.id, prompt);
	}

	function handleRetry(promptId: string) {
		const prompt = channel.prompts.find((item) => item.id === promptId);
		if (!prompt || running || !chat.ready) return;
		scroll.followLatest();
		void chat.ask(channel.id, prompt, true);
	}

	const sidebarProps = {
		channels,
		active: channel.id,
		histories: chat.histories,
		onNavigate: navigate,
		dark,
		onTheme: toggleTheme,
	};

	return (
		<div className="workspace-shell">
			<aside className="workspace-sidebar">
				<ChannelSidebar {...sidebarProps} />
			</aside>
			<div className="workspace-body">
				<WorkspaceTopbar channelName={channel.name} />
				<div className="workspace-columns">
					<main className="conversation" id="main-content" tabIndex={-1}>
						<ChannelHeader
							channel={channel}
							navigation={<MobileChannelDrawer {...sidebarProps} />}
						/>
						<Conversation
							channel={channel}
							history={history}
							scrollRef={scroll.scrollRef}
							nearBottom={scroll.nearBottom}
							onScroll={scroll.onScroll}
							onJumpToLatest={scroll.jumpToLatest}
							onRetry={handleRetry}
						/>
						<PromptPicker
							channel={channel}
							history={history}
							running={running}
							ready={chat.ready}
							storageNotice={chat.storageNotice}
							onAsk={handleAsk}
							onStop={stop}
							onReset={() => chat.clear(channel.id)}
						/>
					</main>
					<ContextPanel channel={channel} />
				</div>
			</div>
			<div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
				{announcement}
			</div>
		</div>
	);
}
