import type { ReactElement } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import {
	ArrowUpRightIcon,
	BriefcaseIcon,
	EnvelopeSimpleIcon,
	GithubLogoIcon,
	LinkedinLogoIcon,
	XIcon,
} from '@phosphor-icons/react';
import { APP_CONSTANTS } from '../../CONSTANTS';
import { siteConfig } from '../../data/site';

const links = [
	{ ...APP_CONSTANTS.github, icon: GithubLogoIcon },
	{ ...APP_CONSTANTS.linkedin, icon: LinkedinLogoIcon },
	{ ...APP_CONSTANTS.email, icon: EnvelopeSimpleIcon, external: false },
];

export default function ProfileDialog({ children }: { children: ReactElement }) {
	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>{children}</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="profile-overlay" />
				<Dialog.Content className="profile-dialog">
					<Dialog.Close asChild>
						<button className="icon-button profile-close" aria-label="Close profile">
							<XIcon size={20} />
						</button>
					</Dialog.Close>
					<div className="profile-art">
						<img src={siteConfig.avatar} width={116} height={116} alt="" />
						<span className="profile-caption">The person behind the pixels.</span>
					</div>
					<Dialog.Title>{siteConfig.name}</Dialog.Title>
					<p className="context-role">{siteConfig.role}</p>
					<Dialog.Description className="context-bio">{siteConfig.bio}</Dialog.Description>
					<div className="context-detail">
						<BriefcaseIcon size={17} />
						<div>
							<span>Currently building</span>
							<strong>{siteConfig.currentWork.product}</strong>
							<small>{siteConfig.currentWork.company}</small>
						</div>
					</div>
					<nav className="profile-links" aria-label="Profile links">
						{links.map(({ label, href, icon: Icon, external }) => (
							<a key={label} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>
								<Icon size={20} />
								<span>{label}</span>
								<ArrowUpRightIcon size={16} />
							</a>
						))}
					</nav>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
