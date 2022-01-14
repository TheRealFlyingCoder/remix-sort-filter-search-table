import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from 'remix';
import type { LinksFunction } from 'remix';

import globalStylesUrl from '~/styles/tailwind.css';

export const links: LinksFunction = () => {
	return [
		{ rel: 'stylesheet', href: globalStylesUrl },
	];
};

export default function App() {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width,initial-scale=1" />
				<link rel="apple-touch-icon" sizes="180x180" href="/images/logo/apple-touch-icon.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/images/logo/favicon-32x32.png" />
				<link rel="icon" type="image/png" sizes="16x16" href="/images/logo/favicon-16x16.png" />
				<link rel="manifest" href="/site.webmanifest" />
				<Meta />
				<Links />
			</head>
			<body className="absolute inset-0 flex flex-col">
				<Outlet />
				<ScrollRestoration />
				<Scripts />
				{process.env.NODE_ENV === 'development' && <LiveReload />}
			</body>
		</html>
	);
}