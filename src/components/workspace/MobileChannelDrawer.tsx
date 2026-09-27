import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ListIcon, XIcon } from '@phosphor-icons/react';
import ChannelSidebar, { type ChannelSidebarProps } from './ChannelSidebar';

export default function MobileChannelDrawer(props: ChannelSidebarProps) {
	const [open, setOpen] = useState(false);

	useEffect(() => setOpen(false), [props.active]);

	function handleNavigate(id: string) {
		props.onNavigate(id);
		setOpen(false);
	}

	return (
		<Dialog.Root open={open} onOpenChange={setOpen}>
			<Dialog.Trigger asChild>
				<button className="icon-button mobile-menu" aria-label="Open channels">
					<ListIcon size={23} />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="drawer-overlay" />
				<Dialog.Content className="channel-drawer">
					<Dialog.Title className="sr-only">Workspace channels</Dialog.Title>
					<Dialog.Description className="sr-only">
						Explore Olly’s background, skills, and work.
					</Dialog.Description>
					<Dialog.Close asChild>
						<button className="icon-button drawer-close" aria-label="Close channels">
							<XIcon size={20} />
						</button>
					</Dialog.Close>
					<ChannelSidebar {...props} onNavigate={handleNavigate} />
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
