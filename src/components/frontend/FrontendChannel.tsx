import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { Channel } from '../../data/channels';
import ChannelIntroduction from '../workspace/ChannelIntroduction';

interface Props {
	channel: Channel;
	// Astro named slots are populated at render time.
	loading?: ReactNode;
	reactivity?: ReactNode;
	html?: ReactNode;
}

const frameworks = ['React', 'Svelte', 'HTML'];

export default function FrontendChannel({ channel, loading, reactivity, html }: Props) {
	const [selected, setSelected] = useState<number | null>(null);
	const [ready, setReady] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => setReady(true), []);
	const examples = [loading, reactivity, html];
	useLayoutEffect(() => {
		if (selected === null) return;
		const pane = scrollRef.current;
		const example = pane?.querySelector<HTMLElement>(`#example-${channel.prompts[selected].id}`);
		if (pane && example) {
			pane.scrollTop += example.getBoundingClientRect().top - pane.getBoundingClientRect().top - 16;
		}
	}, [selected, channel]);

	function selectExample(index: number) {
		setSelected(index);
	}

	return (
		<div className="frontend-channel">
			<div className="conversation-scroll" ref={scrollRef} role="region" tabIndex={0} aria-label="Frontend examples">
				<ChannelIntroduction channel={channel} />
				{selected === null && <p className="frontend-invitation">{channel.openingMessage}</p>}
				{examples.map((example, index) => (
					<section
						key={channel.prompts[index].id}
						id={`example-${channel.prompts[index].id}`}
						aria-label={channel.prompts[index].label}
						hidden={selected !== index}
					>
						{example}
					</section>
				))}
				<p className="frontend-footnote">Built with Astro islands. Each example owns its own behaviour.</p>
			</div>
			<div className="prompt-dock example-picker">
				<div className="prompt-box">
					<div className="prompt-heading">
						<span>Choose a component</span>
						<span className="prompt-hint">Try it. Inspect it.</span>
					</div>
					<div className="prompt-options">
						{channel.prompts.map((prompt, index) => (
							<button
								key={prompt.id}
								type="button"
								aria-pressed={selected === index}
								aria-controls={`example-${prompt.id}`}
								disabled={!ready}
								onClick={() => selectExample(index)}
							>
								<span>{prompt.label}</span>
								<span className="example-framework">{frameworks[index]}</span>
							</button>
							))}
					</div>
				</div>
				<p className="dock-caption">Interactive examples. No AI requests or streamed replies.</p>
			</div>
		</div>
	);
}
