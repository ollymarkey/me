import {
	ArrowUpRightIcon,
	BookOpenIcon,
	CommandIcon,
	HashIcon,
	MoonIcon,
	SunIcon,
} from '@phosphor-icons/react';
import { channels } from '../../data/channels';
import { siteConfig } from '../../data/site';
import type { Histories } from '../../lib/chat/types';
import Avatar from './Avatar';

const groups = ['Start here', 'What I do', 'Explore'] as const;

export interface ChannelSidebarProps {
	active: string;
	histories: Histories;
	onNavigate: (id: string) => void;
	dark: boolean;
	onTheme: () => void;
}

export default function ChannelSidebar({
	active,
	histories,
	onNavigate,
	dark,
	onTheme,
}: ChannelSidebarProps) {
	const themeLabel = `Switch to ${dark ? 'light' : 'dark'} theme`;

	return (
		<>
			<a className="workspace-brand" href="#welcome" onClick={() => onNavigate('welcome')}>
				<span className="brand-symbol">
					<CommandIcon size={22} weight="bold" />
				</span>
				<span>
					Olly’s workspace<small>A personal corner of the internet</small>
				</span>
			</a>
			<div className="sidebar-intro">
				<span className="sidebar-label">Come on in.</span>
				<p>
					A little about me,
					<br />a lot about building things.
				</p>
			</div>
			<nav className="channel-navigation" aria-label="Channels">
				{groups.map((group) => (
					<div className="channel-group" key={group}>
						<h2>{group}</h2>
						{channels
							.filter((channel) => channel.group === group)
							.map((channel) => {
								const questionCount = histories[channel.id]?.length ?? 0;
								return (
									<a
										key={channel.id}
										href={`#${channel.id}`}
										className={`channel-link${active === channel.id ? ' selected' : ''}`}
										aria-current={active === channel.id ? 'page' : undefined}
										onClick={() => onNavigate(channel.id)}
									>
										<HashIcon size={18} />
										<span>{channel.name}</span>
										{questionCount > 0 && (
											<span
												className="channel-count"
												aria-label={`${questionCount} questions asked`}
											>
												{questionCount}
											</span>
										)}
									</a>
								);
							})}
					</div>
				))}
			</nav>
			<div className="sidebar-bottom">
				<a className="sidebar-blog" href="/blog">
					<BookOpenIcon size={17} /> Read the blog <ArrowUpRightIcon size={14} />
				</a>
				<div className="sidebar-profile">
					<Avatar small />
					<span>
						<strong>{siteConfig.name}</strong>
						<small>{siteConfig.shortRole}</small>
					</span>
					<button
						className="icon-button theme-button"
						onClick={onTheme}
						aria-label={themeLabel}
						title={themeLabel}
					>
						{dark ? <SunIcon size={18} /> : <MoonIcon size={18} />}
					</button>
				</div>
			</div>
		</>
	);
}
