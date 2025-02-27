import { expect } from 'chai';
import * as cheerio from 'cheerio';
import { loadFixture } from './test-utils.js';
import testAdapter from '../../../astro/test/test-adapter.js';

describe('SSR pictures - dev', function () {
	let fixture;
	let devServer;
	let $;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/basic-picture/',
			adapter: testAdapter(),
			output: 'server',
		});

		devServer = await fixture.startDevServer();
		const html = await fixture.fetch('/').then((res) => res.text());
		$ = cheerio.load(html);
	});

	after(async () => {
		await devServer.stop();
	});

	describe('Local images', () => {
		it('includes sources', () => {
			const sources = $('#social-jpg source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#social-jpg img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/@astroimage/assets/social.jpg');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('506');
			expect(searchParams.get('h')).to.equal('253');
			expect(image.attr('alt')).to.equal('Social image');
		});

		it('returns the optimized image', async () => {
			const image = $('#social-jpg img');

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal('image/jpeg');

			// TODO: verify image file? It looks like sizeOf doesn't support ArrayBuffers
		});
	});

	describe('Inline imports', () => {
		it('includes sources', () => {
			const sources = $('#inline source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#inline img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/@astroimage/assets/social.jpg');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('506');
			expect(searchParams.get('h')).to.equal('253');
			expect(image.attr('alt')).to.equal('Inline social image');
		});
	});

	describe('Remote images', () => {
		it('includes sources', () => {
			const sources = $('#google source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#google img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/_image');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('png');
			expect(searchParams.get('w')).to.equal('544');
			expect(searchParams.get('h')).to.equal('184');
			expect(searchParams.get('href')).to.equal(
				'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
			);
			expect(image.attr('alt')).to.equal('Google logo');
		});
	});

	describe('/public images', () => {
		it('includes sources', () => {
			const sources = $('#hero source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#hero img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/_image');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('768');
			expect(searchParams.get('h')).to.equal('414');
			expect(searchParams.get('href')).to.equal('/hero.jpg');
			expect(image.attr('alt')).to.equal('Hero image');
		});

		it('returns the optimized image', async () => {
			const image = $('#hero img');

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal('image/jpeg');

			// TODO: verify image file? It looks like sizeOf doesn't support ArrayBuffers
		});
	});
});

describe('SSR pictures with subpath - dev', function () {
	let fixture;
	let devServer;
	let $;

	before(async () => {
		fixture = await loadFixture({
			root: './fixtures/basic-picture/',
			adapter: testAdapter(),
			output: 'server',
			base: '/docs',
		});

		devServer = await fixture.startDevServer();
		const html = await fixture.fetch('/docs/').then((res) => res.text());
		$ = cheerio.load(html);
	});

	after(async () => {
		await devServer.stop();
	});

	describe('Local images', () => {
		it('includes sources', () => {
			const sources = $('#social-jpg source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#social-jpg img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/@astroimage/assets/social.jpg');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('506');
			expect(searchParams.get('h')).to.equal('253');
			expect(image.attr('alt')).to.equal('Social image');
		});

		it('returns the optimized image', async () => {
			const image = $('#social-jpg img');

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal('image/jpeg');

			// TODO: verify image file? It looks like sizeOf doesn't support ArrayBuffers
		});
	});

	describe('Inline imports', () => {
		it('includes sources', () => {
			const sources = $('#inline source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#inline img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/@astroimage/assets/social.jpg');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('506');
			expect(searchParams.get('h')).to.equal('253');
			expect(image.attr('alt')).to.equal('Inline social image');
		});
	});

	describe('Remote images', () => {
		it('includes sources', () => {
			const sources = $('#google source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#google img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/_image');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('png');
			expect(searchParams.get('w')).to.equal('544');
			expect(searchParams.get('h')).to.equal('184');
			expect(searchParams.get('href')).to.equal(
				'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
			);
			expect(image.attr('alt')).to.equal('Google logo');
		});
	});

	describe('/public images', () => {
		it('includes sources', () => {
			const sources = $('#hero source');

			expect(sources.length).to.equal(3);

			// TODO: better coverage to verify source props
		});

		it('includes src, width, and height attributes', () => {
			const image = $('#hero img');

			const src = image.attr('src');
			const [route, params] = src.split('?');

			expect(route).to.equal('/_image');

			const searchParams = new URLSearchParams(params);

			expect(searchParams.get('f')).to.equal('jpg');
			expect(searchParams.get('w')).to.equal('768');
			expect(searchParams.get('h')).to.equal('414');
			expect(searchParams.get('href')).to.equal('/hero.jpg');
			expect(image.attr('alt')).to.equal('Hero image');
		});

		it('returns the optimized image', async () => {
			const image = $('#hero img');

			const res = await fixture.fetch(image.attr('src'));

			expect(res.status).to.equal(200);
			expect(res.headers.get('Content-Type')).to.equal('image/jpeg');

			// TODO: verify image file? It looks like sizeOf doesn't support ArrayBuffers
		});
	});
});
