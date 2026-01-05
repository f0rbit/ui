import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site?.toString() ?? "https://ui.f0rbit.com";
	const baseUrl = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;

	const content = `User-agent: *
Allow: /

# LLM-friendly documentation
Sitemap: ${baseUrl}sitemap.xml
LLMs-Txt: ${baseUrl}llms.txt
`;

	return new Response(content, {
		headers: {
			"Content-Type": "text/plain",
		},
	});
};
