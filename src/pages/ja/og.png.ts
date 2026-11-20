import type { APIRoute } from 'astro';
import { renderOg } from '../../og/render.ts';

export const GET: APIRoute = ({ request }) => renderOg(new URL(request.url), 'ja');
