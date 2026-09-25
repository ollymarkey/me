import type { Exchange } from '../../lib/chat/types';
import ResponseMessage from './ResponseMessage';

interface Props {
	exchange: Exchange;
	onRetry: (promptId: string) => void;
}

export default function MessageExchange({ exchange, onRetry }: Props) {
	return (
		<div className="exchange" id={`exchange-${exchange.promptId}`}>
			<article
				className="message visitor-message"
				aria-label={`Your question: ${exchange.question}`}
			>
				<div className="visitor-avatar">Y</div>
				<div className="message-content">
					<div className="message-author">
						You <span>Exploring</span>
					</div>
					<p>{exchange.question}</p>
				</div>
			</article>
			<ResponseMessage exchange={exchange} onRetry={() => onRetry(exchange.promptId)} />
		</div>
	);
}
