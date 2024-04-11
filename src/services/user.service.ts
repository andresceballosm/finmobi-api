async function scan(message: string) {
	process.stdout.write(message);
	return await new Promise(function(resolve, reject) {
		process.stdin.resume();
		process.stdin.once('data', function(data) {
			process.stdin.pause();
			resolve(data.toString().trim());
		});
	});
}
