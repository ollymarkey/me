import { CheckCircleIcon } from '@phosphor-icons/react';
import type { Channel } from '../../data/channels';
import { siteConfig } from '../../data/site';
import Avatar from './Avatar';

export default function IntroductionMessage({ channel }: { channel: Channel }) {
	return (
		<article className="message introduction-message">
			<Avatar />
			<div className="message-content">
				<div className="message-author">
					{siteConfig.name} <span className="author-badge">That’s me</span>
				</div>
				<p>{channel.openingMessage}</p>
				<div className="intro-signoff">
					<CheckCircleIcon size={14} />
					Prepared responses. A real streaming interface.
				</div>
			</div>
		</article>
	);
}
