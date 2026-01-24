/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * This function fetches the Video Schema from a URL, 
 * reads the VideoObject, extracts the video URL from 
 * contentUrl, generates a downloadable link, and 
 * downloads the video in the browser.
 *
 * PLEASE NOTE: You must allow multiple downloads in 
 * the browser when prompted; otherwise, the browser 
 * will block the download.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
const TITLE_SELECTOR = 'h2.page-title';
const DEFAULT_TITLE = 'video';
const GRID_SELECTOR = '#main .thumb-block';
async function fetchAndDownload(videoPageUrl) {
	// Fetch video page HTML
	const html = await fetch(videoPageUrl, {
		credentials: 'include'
	}).then(r => r.text());

	// Parse HTML
	const doc = new DOMParser().parseFromString(html, 'text/html');

	// Get video title from <h2 class="page-title">
	const rawTitle =
		doc.querySelector(TITLE_SELECTOR)?.textContent || DEFAULT_TITLE;

	const safeTitle = rawTitle
		.replace(/[\\/:*?"<>|]+/g, '')
		.trim();

	// Extract MP4 from VideoObject schema
	const scripts = doc.querySelectorAll(
		'script[type="application/ld+json"]'
	);

	let mp4Url = null;

	for (const script of scripts) {
		try {
			const json = JSON.parse(script.textContent);
			const items = Array.isArray(json) ? json : [json];

			for (const item of items) {
				const type = item['@type'];
				if (
					(type === 'VideoObject' ||
						(Array.isArray(type) && type.includes('VideoObject'))) &&
					typeof item.contentUrl === 'string' &&
					item.contentUrl.includes('.mp4')
				) {
					mp4Url = item.contentUrl;
					break;
				}
			}
		} catch {}
		if (mp4Url) break;
	}

	if (!mp4Url) {
		console.log('MP4 not found');
		return;
	}

	console.log(`Downloading: ${safeTitle}`);

	// Fetch MP4 as Blob (forces download)
	const videoRes = await fetch(mp4Url);
	const blob = await videoRes.blob();

	const blobUrl = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = blobUrl;
	a.download = `${safeTitle}.mp4`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);

	URL.revokeObjectURL(blobUrl);
}
/* * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 * This function loops through the grid and retrieves video URLs for processing.
 * 
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
async function processDownload() {
	var urls = []
	document.querySelectorAll(GRID_SELECTOR).forEach(card => {
		const a = card.querySelector('a[href]');
		if (a && a.href) {
			urls.push(a.href)

		}
	});
	var status = '';
	for (i = 0; i <= urls.length; i++) {
		status = await fetchAndDownload(urls[i]);
	}
}