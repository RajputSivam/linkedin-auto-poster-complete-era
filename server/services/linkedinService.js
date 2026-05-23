import axios from 'axios';

const publishPost = async (accessToken, content, mediaUrl, linkedinId) => {
  if (!accessToken) {
    throw new Error('Missing LinkedIn access token');
  }
  if (!linkedinId) {
    throw new Error('Missing LinkedIn user identifier');
  }

  const author = `urn:li:person:${linkedinId}`;
  const body = {
    author,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: {
          text: content,
        },
        shareMediaCategory: mediaUrl ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  };

  await axios.post('https://api.linkedin.com/v2/ugcPosts', body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
  });

  return { success: true };
};

export default { publishPost };
