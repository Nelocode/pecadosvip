async (page) => {
  const widths = [360, 390, 768, 1024, 1440, 1920];
  const results = [];

  for (const width of widths) {
    await page.setViewportSize({
      width,
      height: width < 500 ? 844 : 900,
    });
    await page.goto('http://127.0.0.1:4191/');
    const row = await page.evaluate(() => ({
      width: innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
      overflow: document.documentElement.scrollWidth > innerWidth,
      h1: document.querySelectorAll('h1').length,
      postForms: Array.from(document.querySelectorAll('form')).filter(
        (form) => form.method.toLowerCase() === 'post',
      ).length,
      externalResources: performance
        .getEntriesByType('resource')
        .filter((entry) => new URL(entry.name).host !== location.host).length,
    }));
    results.push(row);

    if (width === 390 || width === 1440) {
      await page.screenshot({
        path: `output/playwright/home-${width}.png`,
        fullPage: true,
      });
    }
  }

  return results;
}
