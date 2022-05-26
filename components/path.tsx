import { Node } from 'interweave';
import Link from 'next/link';
import { Theme } from '../src/theme';

export default function Path({
  href,
  contents,
  theme,
  className,
}: {
  href: string;
  contents: string | JSX.Element | JSX.Element[] | Node[];
  theme: Theme;
  className?: string;
}) {
  return (
    <Link href={href}>
      <a
        className={`${className ?? ''} ${theme.text.primary} ${
          theme.font.main
        } underline decoration-solid visited:decoration-double`}
      >
        {contents}
      </a>
    </Link>
  );
}
