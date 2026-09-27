import { useEffect, useState } from 'react';
import { CheckCircleIcon, CircleNotchIcon, SparkleIcon } from '@phosphor-icons/react';

const stages = ['Reading the brief', 'Connecting the ideas', 'Shaping the response'];

export default function LoadingExperience() {
	const [stage, setStage] = useState(0);
	const [format, setFormat] = useState('concise');
	const [status, setStatus] = useState<'loading' | 'complete' | 'stopped'>('loading');
	const [run, setRun] = useState(0);
	const [ready, setReady] = useState(false);

	useEffect(() => setReady(true), []);
	useEffect(() => {
		if (status !== 'loading') return;
		const timers = [
			setTimeout(() => setStage(1), 2000),
			setTimeout(() => setStage(2), 4000),
			setTimeout(() => setStatus('complete'), 6000),
		];
		return () => timers.forEach(clearTimeout);
	}, [run, status]);

	function restart() {
		setStage(0);
		setStatus('loading');
		setRun((value) => value + 1);
	}

	return (
		<div className="loading-experience" data-ready={ready}>
			<div className="demo-status" role="status" aria-live="polite">
				{status === 'loading' ? (
					<CircleNotchIcon size={22} className="demo-spinner" aria-hidden="true" />
				) : status === 'complete' ? <CheckCircleIcon size={22} /> : <SparkleIcon size={22} />}
				<span>{status === 'loading' ? stages[stage] : status === 'complete' ? 'Ready when you are' : 'You’re in control. Demo stopped.'}</span>
			</div>
			<div className="loading-stages" aria-hidden="true">
				{stages.map((label, index) => (
					<span key={label} className={status === 'complete' || index <= stage ? 'is-current' : ''} />
				))}
			</div>
			<div className="demo-output" aria-busy={status === 'loading'}>
				{status === 'loading' ? (
					<div className="demo-skeleton" aria-hidden="true"><span /><span /><span /></div>
				) : status === 'complete' ? (
					<p>{format === 'concise'
						? 'Make the wait useful: explain what’s happening, offer a meaningful choice, and leave the user in control.'
						: 'A good loading state does more than fill time. It explains what’s happening, gives people a useful decision to make, and offers a way to stop. Here, your choice changes the result, so the interaction has a purpose beyond keeping you busy.'}</p>
				) : <p>No rush. Run the demo again whenever you like.</p>}
			</div>
			<fieldset className="demo-options" disabled={!ready}>
				<legend>{status === 'loading' ? 'While you wait, make it yours.' : 'Choose how much detail you want.'}</legend>
				<p>This choice changes the finished response.</p>
				<div className="demo-choice-row">
					{['concise', 'detailed'].map((value) => (
						<label key={value}>
							<input type="radio" name="loading-format" value={value} checked={format === value} onChange={() => setFormat(value)} />
							{value === 'concise' ? 'Keep it concise' : 'Give me the detail'}
						</label>
					))}
				</div>
			</fieldset>
			<div className="demo-footer">
				<span>6-second demonstration. No AI call.</span>
				<button type="button" className="demo-button" disabled={!ready} onClick={status === 'loading' ? () => setStatus('stopped') : restart}>
					{status === 'loading' ? 'Stop demo' : 'Run again'}
				</button>
			</div>
		</div>
	);
}
