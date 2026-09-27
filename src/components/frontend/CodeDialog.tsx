import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CodeIcon, XIcon } from '@phosphor-icons/react';

interface Props {
	framework: string;
	filename: string;
	source: string;
	styles: string;
}

export default function CodeDialog({ framework, filename, source, styles }: Props) {
	const [view, setView] = useState<'component' | 'styles'>('component');
	const [ready, setReady] = useState(false);
	useEffect(() => setReady(true), []);

	return (
		<Dialog.Root>
			<Dialog.Trigger asChild>
				<button
					type="button"
					className="icon-button example-code-trigger"
					aria-label={`View ${framework} code`}
					title="View code"
					disabled={!ready}
					onClick={() => setView('component')}
				>
					<CodeIcon size={21} />
				</button>
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Overlay className="source-overlay" />
				<Dialog.Content className="source-dialog">
					<header className="source-dialog-header">
						<Dialog.Title>{framework} source code</Dialog.Title>
						<Dialog.Close asChild>
							<button type="button" className="icon-button" aria-label="Close code">
								<XIcon size={22} />
							</button>
						</Dialog.Close>
					</header>
					<Dialog.Description>
						The actual component source and its shared styles, using the workspace’s colour variables.
					</Dialog.Description>
					<div className="source-view-options" role="group" aria-label="Source file">
						<button type="button" aria-pressed={view === 'component'} onClick={() => setView('component')}>Component</button>
						<button type="button" aria-pressed={view === 'styles'} onClick={() => setView('styles')}>Styles</button>
					</div>
					<p className="source-filename">{view === 'component' ? filename : 'frontend-examples.css'}</p>
					<pre tabIndex={0} aria-label={view === 'component' ? `${framework} component source` : 'Example stylesheet'}>
						<code>{view === 'component' ? source : styles}</code>
					</pre>
				</Dialog.Content>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
