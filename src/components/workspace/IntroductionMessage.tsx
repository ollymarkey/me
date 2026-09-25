import { CheckCircleIcon } from '@phosphor-icons/react';
import type { Channel } from '../../data/channels';
import { siteConfig } from '../../data/site';
import Avatar from './Avatar';

export default function IntroductionMessage({ channel }: { channel: Channel }) {
	const introduction =
		channel.id === 'welcome'
			? 'Glad you’re here. Think of this as a guided conversation, at your own pace. Pick a question below and let’s start there.'
			: `Curious about ${channel.name.replaceAll('-', ' ')}? I’ve put together a few questions below. Pick one to take a closer look.`;

	return (
		<article className="message introduction-message">
			<Avatar />
			<div className="message-content">
				<div className="message-author">
					{siteConfig.name} <span className="author-badge">That’s me</span>
				</div>
				<p>{introduction}</p>
				<div className="intro-signoff">
					<CheckCircleIcon size={14} />
					Prepared responses. A real streaming interface.
				</div>
			</div>
		</article>
	);
}
