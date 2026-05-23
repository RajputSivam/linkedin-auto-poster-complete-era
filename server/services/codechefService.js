import puppeteer from 'puppeteer';

const getCodechefActivity = async (username) => {
  if (!username) return { rating: null, stars: null };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(`https://www.codechef.com/users/${username}`, { waitUntil: 'domcontentloaded' });

    const rating = await page.evaluate(() => {
      const ratingElement = document.querySelector('.rating-number');
      return ratingElement?.textContent?.trim() || null;
    });

    const stars = await page.evaluate(() => {
      const star = document.querySelector('.rating-star');
      return star?.textContent?.trim() || null;
    });

    return { rating, stars };
  } catch (error) {
    return { rating: null, stars: null };
  } finally {
    await browser.close();
  }
};

export default { getCodechefActivity };
