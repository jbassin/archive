import { Theme } from '../src/theme';
import Search from './search';

export default function Title({
  className,
  subheading,
  theme,
}: {
  className?: string;
  subheading?: string;
  theme: Theme;
}) {
  return (
    <div className={className}>
      <div className="flex flex-col md:flex-row items-center mt-6 mb-1">
        <h1 className={`${theme.text.primary} ${theme.font.title} text-2xl`}>
          archive.
          <span
            className={`${theme.text.secondary} ${theme.font.subtitle} text-lg pl-2`}
          >
            {subheading ?? 'a repository of knowledge'}
          </span>
        </h1>
        <div className="flex-grow" />
        <Search className="z-10 w-full md:w-2/5" theme={theme} />
      </div>
    </div>
  );
}
