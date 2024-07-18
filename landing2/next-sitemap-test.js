//https://www.npmjs.com/package/next-sitemap
module.exports = {
    ...module.exports,
    siteUrl: process.env.SITE_URL || 'https://test.transbithub.com',
    generateRobotsTxt: true, // (optional)
    exclude: ['/aggregator/sitemap.xml', '/aggregator/test'],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                disallow: '/',
            },
            {
                userAgent: '*',
                disallow: '/?gbid=*',
            },
        ],
        additionalSitemaps: [
            'https://test.transbithub.com/docs-static/sitemap.xml',
            'https://test.transbithub.com/aggregator/sitemap.xml'
        ],
    },
}