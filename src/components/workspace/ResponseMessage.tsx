import { ArrowCounterClockwiseIcon } from '@phosphor-icons/react';
import { siteConfig } from '../../data/site';
import type { Exchange } from '../../lib/chat/types';
import Avatar from './Avatar';
import ResponseLinks from './ResponseLinks';

interface Props {
	exchange: Exchange;
	onRetry: () => void;
}

export default function ResponseMessage({ exchange, onRetry }: Props) {
	const streaming = exchange.status === 'connecting' || exchange.status === 'streaming';
	const recoverable = exchange.status === 'error' || exchange.status === 'interrupted';

	return (
		<article
			className="message response-message"
			aria-label={`Response to ${exchange.question}`}
			aria-busy={streaming}
		>
			<Avatar />
			<div className="message-content">
				<div className="message-author">
					{siteConfig.name} <span className="authored-label">Prepared response</span>
				</div>
				{exchange.text ? (
					<div className={`response-copy${streaming ? ' is-streaming' : ''}`}>
						{exchange.text.split('\n\n').map((paragraph, index) => (
							<p key={index}>{paragraph}</p>
						))}
					</div>
				) : streaming ? (
					<div className="connecting-state">
						<span />
						<span />
						<span />
						<span className="connecting-label">Getting that for you</span>
					</div>
				) : null}
				{exchange.status === 'complete' && <ResponseLinks links={exchange.links} />}
				{recoverable && (
					<div className="response-recovery">
						<span>{exchange.error || 'Response stopped. Pick it up whenever you like.'}</span>
						<button onClick={onRetry}>
							<ArrowCounterClockwiseIcon size={14} />
							Retry
						</button>
					</div>
				)}
			</div>
		</article>
	);
}
