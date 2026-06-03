const axios = require('axios');

(async () => {
    try {
        const r1 = await axios.get('https://api.github.com/users/octocat/events', {
            headers: { Accept: 'application/vnd.github.v3+json' },
        });
        console.log('GITHUB_STATUS', r1.status, 'COUNT', Array.isArray(r1.data) ? r1.data.length : typeof r1.data);
    } catch (e) {
        console.error('GITHUB_ERROR', e.response && e.response.status, e.response && e.response.data);
    }

    try {
        const query = 'query recentSubmissionList($username: String!) { recentSubmissionList(username: $username) { submissionDate title lang statusDisplay } }';
        const r2 = await axios.post(
            'https://leetcode.com/graphql',
            { query, variables: { username: 'qa' } },
            { headers: { 'Content-Type': 'application/json' } }
        );
        console.log('LEETCODE_STATUS', r2.status, 'COUNT', (r2.data && r2.data.data && r2.data.data.recentSubmissionList || []).length);
    } catch (e) {
        console.error('LEETCODE_ERROR', e.response && e.response.status, e.response && e.response.data);
    }
})();
