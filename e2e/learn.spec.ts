import { test, expect, type Page } from '@playwright/test';
import translations from '../client/i18n/locales/english/translations.json';
import words from '../client/i18n/locales/english/motivation.json';

let page: Page;

// const superBlocks = [
//   'Responsive Web Design',
//   'JavaScript Algorithms and Data Structures',
//   'Front End Development Libraries',
//   'Data Visualization',
//   'Relational Database',
//   'Back End Development and APIs',
//   'Quality Assurance',
//   'Scientific Computing with Python',
//   'Data Analysis with Python',
//   'Information Security',
//   'Machine Learning with Python',
//   'College Algebra with Python',
//   'Foundational C# with Microsoft',
//   'Coding Interview Prep',
//   'Project Euler'
// ];

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
  await page.goto('/learn');
});

test('the page should render with correct title', async () => {
  await expect(page).toHaveTitle(
    'Learn to Code — For Free — Coding Courses for Busy People'
  );
});

test('the page should have the correct header', async () => {
  const header = page.getByTestId('learn-heading');
  await expect(header).toBeVisible();
  await expect(header).toContainText(translations.learn.heading);
});

test('the page should have all static data correctly placed', async () => {
  const learnReadThisSection = page.getByTestId('learn-read-this-section');
  await expect(learnReadThisSection).toBeVisible();

  const learnReadThisSectionHeading = page.getByTestId(
    'learn-read-this-heading'
  );
  await expect(learnReadThisSectionHeading).toBeVisible();

  const learnReadThisSectionParagraphs = page.getByTestId('learn-read-this-p');
  await expect(learnReadThisSectionParagraphs).toHaveCount(10);

  for (const paragraph of await learnReadThisSectionParagraphs.all()) {
    await expect(paragraph).toBeVisible();
  }
});

// Enable this again after we release the 4 new superblocks
// test('the page renders all curriculum certifications', async () => {
//   const curriculumBtns = page.getByTestId('curriculum-map-button');
//   await expect(curriculumBtns).toHaveCount(15);
//   for (let i = 0; i < superBlocks.length; i++) {
//     const btn = curriculumBtns.nth(i);
//     await expect(btn).toContainText(superBlocks[i]);
//   }
// });

test.describe('Learn (authenticated user)', () => {
  test.use({ storageState: 'playwright/.auth/certified-user.json' });

  test('the page shows a random quote for an authenticated user', async () => {
    const shownQuote = await page.getByTestId('random-quote').textContent();

    const shownAuthorText = await page
      .getByTestId('random-author')
      .textContent();

    const shownAuthor = shownAuthorText?.replace('- ', '');

    const allMotivationalQuotes = words.motivationalQuotes.map(mq => mq.quote);
    const allAuthors = words.motivationalQuotes.map(mq => mq.author);

    expect(allMotivationalQuotes).toContain(shownQuote);
    expect(allAuthors).toContain(shownAuthor);
  });
});
