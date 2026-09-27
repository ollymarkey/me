import { ArrowUpRightIcon } from '@phosphor-icons/react';
import type { ResponseLink } from '../../lib/chat/types';

export default function ResponseLinks({ links }: { links: ResponseLink[] }) {
	if (!links.length) return null;

	return (
		<div className="response-links">
			{links.map((link) => {
				const external = link.href.startsWith('https:');
				return (
					<a
						key={link.href}
						href={link.href}
						target={external ? '_blank' : undefined}
						rel={external ? 'noreferrer' : undefined}
					>
						<span>
							<strong>{link.label}</strong>
							{link.detail && <small>{link.detail}</small>}
						</span>
						<ArrowUpRightIcon size={18} />
					</a>
				);
			})}
		</div>
	);
}
