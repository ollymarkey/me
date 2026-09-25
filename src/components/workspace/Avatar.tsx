import { siteConfig } from '../../data/site';

export default function Avatar({ small = false }: { small?: boolean }) {
	return (
		<img
			className={`olly-avatar${small ? ' small' : ''}`}
			src={siteConfig.avatar}
			alt=""
			width={40}
			height={40}
		/>
	);
}
