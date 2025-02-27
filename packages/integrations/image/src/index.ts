import type { AstroConfig, AstroIntegration } from 'astro';
import { ssgBuild } from './build/ssg.js';
import type { ImageService, TransformOptions } from './loaders/index.js';
import type { LoggerLevel } from './utils/logger.js';
import { joinPaths, prependForwardSlash, propsToFilename } from './utils/paths.js';
import { createPlugin } from './vite-plugin-astro-image.js';

export { getImage } from './lib/get-image.js';
export { getPicture } from './lib/get-picture.js';

const PKG_NAME = '@astrojs/image';
const ROUTE_PATTERN = '/_image';

interface ImageIntegration {
	loader?: ImageService;
	addStaticImage?: (transform: TransformOptions) => string;
}

declare global {
	// eslint-disable-next-line no-var
	var astroImage: ImageIntegration | undefined;
}

export interface IntegrationOptions {
	/**
	 * Entry point for the @type {HostedImageService} or @type {LocalImageService} to be used.
	 */
	serviceEntryPoint?: string;
	logLevel?: LoggerLevel;
}

export default function integration(options: IntegrationOptions = {}): AstroIntegration {
	const resolvedOptions = {
		serviceEntryPoint: '@astrojs/image/sharp',
		logLevel: 'info' as LoggerLevel,
		...options,
	};

	let _config: AstroConfig;

	// During SSG builds, this is used to track all transformed images required.
	const staticImages = new Map<string, Map<string, TransformOptions>>();

	function getViteConfiguration() {
		return {
			plugins: [createPlugin(_config, resolvedOptions)],
			optimizeDeps: {
				include: ['image-size', 'sharp'],
			},
			ssr: {
				noExternal: ['@astrojs/image', resolvedOptions.serviceEntryPoint],
			},
		};
	}

	return {
		name: PKG_NAME,
		hooks: {
			'astro:config:setup': ({ command, config, updateConfig, injectRoute }) => {
				_config = config;

				updateConfig({ vite: getViteConfiguration() });

				if (command === 'dev' || config.output === 'server') {
					injectRoute({
						pattern: ROUTE_PATTERN,
						entryPoint: '@astrojs/image/endpoint',
					});
				}
			},
			'astro:build:setup': () => {
				// Used to cache all images rendered to HTML
				// Added to globalThis to share the same map in Node and Vite
				function addStaticImage(transform: TransformOptions) {
					const srcTranforms = staticImages.has(transform.src)
						? staticImages.get(transform.src)!
						: new Map<string, TransformOptions>();

					const filename = propsToFilename(transform);

					srcTranforms.set(filename, transform);
					staticImages.set(transform.src, srcTranforms);

					// Prepend the Astro config's base path, if it was used.
					// Doing this here makes sure that base is ignored when building
					// staticImages to /dist, but the rendered HTML will include the
					// base prefix for `src`.
					return prependForwardSlash(joinPaths(_config.base, filename));
				}

				// Helpers for building static images should only be available for SSG
				globalThis.astroImage =
					_config.output === 'static'
						? {
								addStaticImage,
						  }
						: {};
			},
			'astro:build:done': async ({ dir }) => {
				if (_config.output === 'static') {
					// for SSG builds, build all requested image transforms to dist
					const loader = globalThis?.astroImage?.loader;

					if (loader && 'transform' in loader && staticImages.size > 0) {
						await ssgBuild({
							loader,
							staticImages,
							config: _config,
							outDir: dir,
							logLevel: resolvedOptions.logLevel,
						});
					}
				}
			},
		},
	};
}
