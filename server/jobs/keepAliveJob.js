import cron from 'node-cron';
import axios from 'axios';

export const KEEP_ALIVE_CRON_EXPRESSION = '*/10 * * * *';

const getBaseUrl = () => {
    const configuredUrl = process.env.RENDER_EXTERNAL_URL || process.env.BACKEND_URL;

    if (configuredUrl) {
        return configuredUrl.replace(/\/$/, '');
    }

    if (process.env.LINKEDIN_CALLBACK_URL) {
        return process.env.LINKEDIN_CALLBACK_URL.replace(/\/auth\/linkedin\/callback$/, '');
    }

    return `http://localhost:${process.env.PORT || 5000}`;
};

const keepAliveJob = () => {
    cron.schedule(
        KEEP_ALIVE_CRON_EXPRESSION,
        async () => {
            const url = `${getBaseUrl()}/health`;

            try {
                await axios.get(url, { timeout: 15000 });
                console.log(`Keep-alive ping succeeded: ${url}`);
            } catch (error) {
                console.error(`Keep-alive ping failed for ${url}:`, error.message);
            }
        },
        {
            timezone: 'UTC',
        }
    );
};

export default keepAliveJob;
