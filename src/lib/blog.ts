export function sortBlogEntries<T extends { data: { pubDate: Date } }>(entries: T[]) {
	return [...entries].sort((first, second) => second.data.pubDate.valueOf() - first.data.pubDate.valueOf());
}

export function formatDate(date: Date) {
	return new Intl.DateTimeFormat('en-AU', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	}).format(date);
}

export function getReadingTime(content: string) {
	const words = content.trim().split(/\s+/).filter(Boolean).length;
	const minutes = Math.max(1, Math.round(words / 200));

	return `${minutes} min read`;
}
