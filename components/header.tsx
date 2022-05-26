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
  return (
    <div className={`${className} flex flex-col`}>
      <Title subheading={subheading} theme={theme} />
      <Bookend theme={theme} />
    </div>
  );
}
