import { useRouter } from 'next/router';
import { Theme } from '../src/theme';
import Bookend from './bookend';
import Title from './title';

export default function Header({
  subheading,
  theme,
  className,
}: {
  theme: Theme;
  subheading?: string;
  className?: string;
}) {
  const router = useRouter();

  return (
    <div className={`${className} flex flex-col`}>
      <Title
        className="cursor-pointer"
        subheading={subheading}
        theme={theme}
        onClick={() => router.push('/')}
      />
      <Bookend theme={theme} />
    </div>
  );
}
