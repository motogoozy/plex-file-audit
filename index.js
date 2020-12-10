#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const args = require('minimist')(process.argv.slice(2), {
	string: ['dir'],
	boolean: ['verbose'],
	alias: {
		h: 'help',
		d: 'dir',
		v: 'verbose',
	},
});

(async function main() {
	if (args.help || process.argv.length <= 2 || !args.dir) {
		printHelp();
	}

	try {
		console.log('Scanning files...')
		const files = await fs.promises.readdir(args.dir);
		for (const file of files) {
			let filepath = path.join(args.dir, file);
			let stat = await fs.promises.stat(filepath);
			if (stat.isFile()) {
				args.verbose && console.log(`File detected: ${file}`);
				let extensions = ['mp4', 'MP4', 'mkv', 'MKV'];
				let newDirName = file;
				if (extensions.includes(newDirName.split('.').slice(-1)[0])) {
					newDirName = newDirName.split('.');
					newDirName.pop();
					newDirName = newDirName.join('');
				}
				if (!fs.existsSync(path.join(args.dir, newDirName))) {
					args.verbose && console.log('Creating directory...');
					fs.mkdirSync(path.join(args.dir, newDirName));
				}
				await fs.promises.rename(filepath, path.join(args.dir, newDirName, file));
				args.verbose && console.log('Moved file into new directory');
			} else {
				// console.log(`${file} is a directory`);
			}
		}
		console.log('Finished!')
	} catch (err) {
		console.log(err)
	}
})()

function printHelp() {
	console.log('plex-audit usage:');
	console.log('');
	console.log('-h, --help                  print this help');
	console.log('-d, --dir                   set path to directory')
	console.log('-v, --verbose                print more detailed output of program actions')
	console.log('');
	console.log('');
}