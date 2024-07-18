const withPlugins = require('next-compose-plugins')
const withMDX = require('@next/mdx')()


module.exports = withPlugins(
    [
        withMDX({
            pageExtensions: ['ts', 'tsx', 'mdx', 'js'],
            remarkPlugins: [
//                require('remark-slug'),
//                require('remark-footnotes'),
//                require('remark-code-titles'),
            ],
//            rehypePlugins: [require('mdx-prism')],
        }),
    ],
)
/*
module.exports = {
    ...module.exports,
    //basePath: 'https://transbithub.com',
}
*/