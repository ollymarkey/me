import {
	ArrowCounterClockwiseIcon,
	ArrowUpRightIcon,
	ChatCircleTextIcon,
	CheckIcon,
	SparkleIcon,
	SquareIcon,
} from '@phosphor-icons/react';
import type { Channel, Prompt } from '../../data/channels';
import type { Exchange } from '../../lib/chat/types';

interface Props {
	channel: Channel;
	history: Exchange[];
	running: boolean;
	ready: boolean;
	storageNotice: boolean;
	onAsk: (prompt: Prompt) => void;
	onStop: () => void;
	onReset: () => void;
}

function promptHeading(channel: Channel, askedCount: number, running: boolean) {
	if (running) return 'A little more context, coming through…';
	if (askedCount === channel.prompts.length) return 'You’ve explored this channel';
	return `Ask about ${channel.id === 'welcome' ? 'me' : channel.name.replaceAll('-', ' ')}`;
}

export default function PromptPicker({
	channel,
	history,
	running,
	ready,
	storageNotice,
	onAsk,
	onStop,
	onReset,
}: Props) {
	return (
		<section className="prompt-dock" aria-label="Suggested questions">
			<div className="prompt-box">
				<div className="prompt-heading">
					<span>
						<SparkleIcon size={16} />
						{promptHeading(channel, history.length, running)}
					</span>
					{running ? (
						<button className="stop-button" onClick={onStop}>
							<SquareIcon size={11} weight="fill" />
							Stop
						</button>
					) : history.length > 0 ? (
						<button
							className="reset-button"
							onClick={onReset}
							title="Clear this channel’s conversation"
						>
							<ArrowCounterClockwiseIcon size={14} />
							Reset
						</button>
					) : (
						<span className="prompt-hint">Choose a question</span>
					)}
				</div>
				<div className="prompt-options">
					{channel.prompts.map((prompt) => {
						const asked = history.some((item) => item.promptId === prompt.id);
						return (
							<button
								key={prompt.id}
								disabled={running || !ready}
								className={asked ? 'asked' : ''}
								onClick={() => onAsk(prompt)}
								title={asked ? `View your question: ${prompt.question}` : prompt.question}
							>
								<span>{prompt.label}</span>
								{asked ? <CheckIcon size={15} /> : <ArrowUpRightIcon size={15} />}
							</button>
						);
					})}
				</div>
			</div>
			<div className="dock-caption">
				<span>
					<ChatCircleTextIcon size={12} />
					{storageNotice
						? 'History is available until you leave this page.'
						: 'Just for you. Saved in this browser tab.'}
				</span>
				<span>Curated questions, considered answers.</span>
			</div>
		</section>
	);
}
