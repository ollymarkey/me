import { ArrowRightIcon, ChatCircleTextIcon, HashIcon } from '@phosphor-icons/react';
import type { Channel } from '../../data/channels';

export default function ChannelIntroduction({ channel }: { channel: Channel }) {
	const isWelcome = channel.id === 'welcome';

	return (
		<div className="channel-welcome">
			<div className="welcome-glyph">
				{isWelcome ? <ChatCircleTextIcon size={33} weight="duotone" /> : <HashIcon size={34} />}
			</div>
			<div className="channel-start">The beginning of #{channel.name}</div>
			<h2>{channel.title}</h2>
			<p>{channel.intro}</p>
			{isWelcome && (
				<div className="welcome-shortcuts">
					<a href="#about-me">
						<span>Meet Olly</span>
						<ArrowRightIcon size={15} />
					</a>
					<a href="#projects">
						<span>Explore the work</span>
						<ArrowRightIcon size={15} />
					</a>
				</div>
			)}
		</div>
	);
}
