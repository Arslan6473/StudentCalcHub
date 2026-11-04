import Link from 'next/link'
import type { MDXRemoteProps } from 'next-mdx-remote/rsc'

/**
 * Custom element renderers for MDX content. Styled by hand rather than with a
 * typography plugin — there are few enough element types in a tool article
 * that hand-mapping them is simpler than overriding a plugin's defaults.
 */
export const mdxComponents: MDXRemoteProps['components'] = {
  h2: (props) => <h2 className="text-ink mt-10 mb-4 text-2xl font-semibold" {...props} />,
  h3: (props) => <h3 className="text-ink mt-8 mb-3 text-lg font-semibold" {...props} />,
  p: (props) => <p className="text-ink-muted mb-4 leading-relaxed" {...props} />,
  ul: (props) => <ul className="text-ink-muted mb-4 list-disc space-y-1.5 pl-5" {...props} />,
  ol: (props) => <ol className="text-ink-muted mb-4 list-decimal space-y-1.5 pl-5" {...props} />,
  li: (props) => <li className="leading-relaxed" {...props} />,
  strong: (props) => <strong className="text-ink font-semibold" {...props} />,
  a: ({ href, ...props }) =>
    href?.startsWith('/') ? (
      <Link href={href} className="text-accent underline underline-offset-2" {...props} />
    ) : (
      <a href={href} className="text-accent underline underline-offset-2" {...props} />
    ),
  code: (props) => (
    <code className="figures bg-surface-muted text-ink rounded px-1.5 py-0.5 text-sm" {...props} />
  ),
  pre: (props) => (
    <pre
      className="figures rounded-card border-line bg-surface-muted mb-4 overflow-x-auto border p-4 text-sm"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote className="border-accent text-ink-muted mb-4 border-l-2 pl-4 italic" {...props} />
  ),
  table: (props) => (
    <div className="rounded-card border-line mb-4 overflow-x-auto border">
      <table className="figures w-full text-sm" {...props} />
    </div>
  ),
  thead: (props) => (
    <thead className="border-line bg-surface-muted border-b text-left" {...props} />
  ),
  tr: (props) => <tr className="border-line border-b last:border-b-0" {...props} />,
  th: (props) => <th className="text-ink-muted px-3 py-2 font-medium" {...props} />,
  td: (props) => <td className="px-3 py-2" {...props} />,
  hr: () => <hr className="border-line my-8" />,
}
