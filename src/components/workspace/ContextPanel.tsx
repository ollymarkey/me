import {
	ArrowRightIcon,
	ArrowUpRightIcon,
	BriefcaseIcon,
	CodeIcon,
	EnvelopeSimpleIcon,
	GithubLogoIcon,
	HashIcon,
	InfoIcon,
	LinkedinLogoIcon,
} from '@phosphor-icons/react';
import { APP_CONSTANTS } from '../../CONSTANTS';
import type { Channel } from '../../data/channels';
import { siteConfig } from '../../data/site';

export default function ContextPanel({ channel }: { channel: Channel }) {
	return (
		<aside className="context-panel" aria-label="Workspace context">
			<div className="context-heading">
				<InfoIcon size={16} />
				<span>A little context</span>
			</div>
			<div className="profile-art">
				<img src={siteConfig.avatar} width={116} height={116} alt={siteConfig.name} />
				<span className="profile-caption">The person behind the pixels.</span>
			</div>
			<h2>{siteConfig.name}</h2>
			<p className="context-role">{siteConfig.role}</p>
			<p className="context-bio">{siteConfig.bio}</p>
			<div className="context-detail">
				<BriefcaseIcon size={17} />
				<div>
					<span>Currently building</span>
					<strong>{siteConfig.currentWork.product}</strong>
					<small>{siteConfig.currentWork.company}</small>
				</div>
			</div>
			<div className="context-divider" />
			<h3>Start a real conversation</h3>
			<p className="context-note">Have a project in mind? I’d like to hear about it.</p>
			<a className="contact-link" href={APP_CONSTANTS.email.href}>
				Get in touch <ArrowUpRightIcon size={15} />
			</a>
			<div className="context-socials">
				<a
					href={APP_CONSTANTS.github.href}
					target="_blank"
					rel="noreferrer"
					aria-label="Olly on GitHub"
				>
					<GithubLogoIcon size={20} />
				</a>
				<a
					href={APP_CONSTANTS.linkedin.href}
					target="_blank"
					rel="noreferrer"
					aria-label="Olly on LinkedIn"
				>
					<LinkedinLogoIcon size={20} />
				</a>
				<a href={APP_CONSTANTS.email.href} aria-label="Email Olly">
					<EnvelopeSimpleIcon size={20} />
				</a>
			</div>
			<div className="workspace-note">
				<CodeIcon size={18} />
				<p>
					This site is a working example.
					<br />
					<a href="#projects">
						Explore the build <ArrowRightIcon size={13} />
					</a>
				</p>
			</div>
			<div className="context-channel-note">
				<HashIcon size={14} />
				<span>{channel.name}</span>
				<span>Make yourself at home.</span>
			</div>
		</aside>
	);
}
