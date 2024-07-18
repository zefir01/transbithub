//https://www.npmjs.com/package/next-sitemap
module.exports = {
    ...module.exports,
    siteUrl: process.env.SITE_URL || 'https://transbithub.com',
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
            'https://transbithub.com/docs-static/sitemap.xml',
            'https://transbithub.com/aggregator/sitemap.xml'
        ],
    },
}