import test from 'node:test';
import assert from 'node:assert/strict';

import { WEEKLY_CRON_EXPRESSION, WEEKLY_TIMEZONE } from './weeklyJob.js';
import { KEEP_ALIVE_CRON_EXPRESSION } from './keepAliveJob.js';

test('weekly cron uses UTC 9 PM IST schedule', () => {
    assert.equal(WEEKLY_CRON_EXPRESSION, '30 15 * * 0');
    assert.equal(WEEKLY_TIMEZONE, 'UTC');
});

test('keep-alive cron pings every 10 minutes', () => {
    assert.equal(KEEP_ALIVE_CRON_EXPRESSION, '*/10 * * * *');
});
