//backend/testimport.mjs
(async () => {
	try {
		await import('./routes/influencers.js');
		console.log('influencers ok');
		await import('./routes/sponsorships.js');
		console.log('sponsorships ok');
		await import('./middleware/authMiddleware.js');
		console.log('auth ok');
	} catch (e) {
		console.error('import error', e);
		process.exit(1);
	}
})();
