import type { RefObject } from 'react';
import { ArrowDownIcon } from '@phosphor-icons/react';
import type { Channel } from '../../data/channels';
import type { Exchange } from '../../lib/chat/types';
import ChannelIntroduction from './ChannelIntroduction';
import IntroductionMessage from './IntroductionMessage';
import MessageExchange from './MessageExchange';

interface Props {
	channel: Channel;
	history: Exchange[];
	scrollRef: RefObject<HTMLDivElement | null>;
	nearBottom: boolean;
	onScroll: () => void;
	onJumpToLatest: () => void;
	onRetry: (promptId: string) => void;
}

export default function Conversation({
	channel,
	history,
	scrollRef,
	nearBottom,
	onScroll,
	onJumpToLatest,
	onRetry,
}: Props) {
	return (
		<>
			<div
				className="conversation-scroll"
				ref={scrollRef}
				tabIndex={0}
				aria-label={`${channel.name} conversation`}
				onScroll={onScroll}
			>
				<ChannelIntroduction key={channel.id} channel={channel} />
				<div className="conversation-divider">
					<span>{history.length ? 'Your conversation' : 'An open invitation'}</span>
				</div>
				<IntroductionMessage channel={channel} />
				{history.map((exchange) => (
					<MessageExchange key={exchange.id} exchange={exchange} onRetry={onRetry} />
				))}
				<div className="conversation-end" />
			</div>
			{!nearBottom && history.length > 0 && (
				<button className="jump-latest" onClick={onJumpToLatest}>
					<ArrowDownIcon size={14} />
					Jump to latest
				</button>
			)}
		</>
	);
}
