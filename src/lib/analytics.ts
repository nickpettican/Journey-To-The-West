// Google Analytics (GA4) loader, ported from offering-bowl. Only called once the
// visitor has accepted cookies (GDPR): no analytics script or cookie exists before
// consent. Same property as middlewaymusings.com.
const MEASUREMENT_ID = 'G-9DKZ2SYTQK';

declare global {
	interface Window {
		dataLayer: unknown[];
		gtag?: (...args: unknown[]) => void;
	}
}

let injected = false;
let lastPath = '';

export function loadAnalytics(): void {
	// idempotent: accept-click and the on-mount restore must not double-inject
	if (injected) return;
	injected = true;

	const script = document.createElement('script');
	script.async = true;
	script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
	document.head.appendChild(script);

	window.dataLayer = window.dataLayer || [];
	window.gtag = function gtag() {
		// gtag relies on the arguments object; mirrors Google's official snippet
		// eslint-disable-next-line prefer-rest-params
		window.dataLayer.push(arguments);
	};
	window.gtag('js', new Date());
	// SPA: suppress the automatic page_view and send one per navigation ourselves
	window.gtag('config', MEASUREMENT_ID, { send_page_view: false });

	trackPageView(window.location.pathname + window.location.search);
}

// GA4 page_view for a client-side navigation. No-op until consent loads gtag;
// dedupes consecutive identical paths so the first load isn't counted twice.
export function trackPageView(path: string): void {
	if (!window.gtag || path === lastPath) return;
	lastPath = path;
	window.gtag('event', 'page_view', {
		page_location: window.location.href,
		page_title: document.title
	});
}
