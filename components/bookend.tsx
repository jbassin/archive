import { Theme } from '../src/theme';
export default function Bookend({
  className,
  theme,
}: {
  className?: string;
  theme: Theme;
}) {
  return (
    <div className={className}>
      <div className="hidden md:block relative h-32 overflow-hidden rounded">
        <img
          src={theme.header}
          alt="header bookend"
          className="absolute w-full"
        />
      </div>
    </div>
  );
}
