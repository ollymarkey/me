import type { ReactNode } from 'react';
import { HashIcon, PushPinIcon } from '@phosphor-icons/react';
import type { Channel } from '../../data/channels';
import Avatar from './Avatar';

interface Props {
	channel: Channel;
	navigation: ReactNode;
}

export default function ChannelHeader({ channel, navigation }: Props) {
	return (
		<>
			<header className="channel-header">
				{navigation}
				<div className="channel-heading">
					<h1>
						<HashIcon size={24} weight="regular" />
						{channel.name}
					</h1>
					<p>{channel.topic}</p>
				</div>
				<div className="channel-members">
					<Avatar small />
					<span>Just you & me</span>
				</div>
			</header>
			<div className="pinned-note">
				<PushPinIcon size={15} />
				<span>{channel.pinned}</span>
			</div>
		</>
	);
}
