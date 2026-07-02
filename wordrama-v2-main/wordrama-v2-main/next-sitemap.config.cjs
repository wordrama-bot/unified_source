/** @type {import('next-sitemap').IConfig} */

module.exports = {
  siteUrl: 'https://wordrama.io',
  changefreq: 'daily',
  priority: 0.7,
  sitemapSize: 5000,
  generateRobotsTxt: true,
  exclude: [],
  alternateRefs: [
    //{
    //  href: 'https://es.example.com',
    //  hreflang: 'es',
    //},
  ],
  // Default transformation function
  transform: async (config, path) => {
    return {
      loc: path, // => this will be exported as http(s)://<config.siteUrl>/<path>
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
      alternateRefs: config.alternateRefs ?? [],
    }
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
    await config.transform(config, '/about'),
    await config.transform(config, '/acceptable-use'),
    await config.transform(config, '/achievements'),
    await config.transform(config, '/benefits-of-word-games'),
    await config.transform(config, '/best-starting-words'),
    await config.transform(config, '/contact'),
    await config.transform(config, '/cookies'),
    await config.transform(config, '/disclaimer'),
    await config.transform(config, '/free-play'),
    await config.transform(config, '/how-to-play'),
    await config.transform(config, '/marketplace'),
    await config.transform(config, '/marketplace/word-packs'),
    await config.transform(config, '/privacy-policy'),
    await config.transform(config, '/returns-policy'),
    await config.transform(config, '/shipping-policy'),
    await config.transform(config, '/teams'),
    await config.transform(config, '/terms-of-use'),
    await config.transform(config, '/wordle-strategy'),
    await config.transform(config, '/wordle-tips'),
  ],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
      //{
       // userAgent: 'test-bot',
       // allow: ['/path', '/path-2'],
      //},
    ],
    additionalSitemaps: [
      //'https://example.com/my-custom-sitemap-1.xml',
    ],
  },
}
