import { parse } from 'path';
import { execSync } from 'child_process';
import { compile } from 'svelte/compiler';
import { getSvelteConfig } from './svelteconfig';

const processSync =
	(options = {}) =>
	(source, filename) => {
		const { debug, preprocess, rootMode } = options;
		let processed = source;
		if (preprocess) {
			const svelteConfig = getSvelteConfig(rootMode, filename);
			const preprocessor = require.resolve('./preprocess.js');
			processed = execSync(
				`node --unhandled-rejections=strict --abort-on-uncaught-exception "${preprocessor}"`,
				{ env: { PATH: process.env.PATH, source, filename, svelteConfig } }
			).toString();
			if (debug) console.log(processed);
			return processed;
		} else {
			return source;
		}
	};

const transform = (source, filename) => {
	const { name } = parse(filename);

	const preprocessed = processSync({ preprocess: true })(source, filename);

	const { js, warnings } = compile(preprocessed, {
		name: name[0].toUpperCase() + name.slice(1),
		format: 'cjs',
		filename,
	});

	warnings.forEach((warning) => {
		console.warn('\x1b[37m%s\x1b[0m', `\n${warning.filename}:`);
		console.warn('\x1b[33m%s\x1b[0m', warning.message);
		console.warn('\x1b[90m%s\x1b[0m', warning.frame);
	});

	return js.code;
};

export { transform };
