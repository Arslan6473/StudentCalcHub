import { MDXRemote, type MDXRemoteProps } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

import { mdxComponents } from '@/components/content/mdx-components'

/** Renders tool articles and blog posts with the same plugins, so heading ids match the blog's table of contents. */
const MDX_OPTIONS = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]],
  },
} satisfies MDXRemoteProps['options']

export function Mdx({ source }: { source: string }) {
  return <MDXRemote source={source} components={mdxComponents} options={MDX_OPTIONS} />
}

