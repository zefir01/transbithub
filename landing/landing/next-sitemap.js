//https://www.npmjs.com/package/next-sitemap
module.exports = {
    ...module.exports,
    siteUrl: process.env.SITE_URL || 'https://transbithub.com',
    generateRobotsTxt: true, // (optional)
}