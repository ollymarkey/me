import { SidebarSimpleIcon, SparkleIcon } from '@phosphor-icons/react';

export default function WorkspaceTopbar({ channelName }: { channelName: string }) {
	return (
		<header className="workspace-topbar">
			<div className="topbar-breadcrumb">
				<SidebarSimpleIcon size={17} />
				<span>Personal workspace</span>
				<span className="breadcrumb-slash">/</span>
				<strong>{channelName}</strong>
			</div>
			<div className="topbar-note">
				<span className="availability-mark">
					<SparkleIcon size={13} />
				</span>
				Built to be explored
			</div>
		</header>
	);
}
