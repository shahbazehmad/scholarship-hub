console.error('Legacy destructive JSON updater disabled in this architecture branch. Existing JSON data is preserved. Use node scripts/collect-opportunities.mjs --plan, then configure and approve database ingestion separately.');
process.exitCode=1;
