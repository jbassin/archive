import { useEffect } from 'react';
import { useLocalStorage } from '../src/local_storage';
import { Theme } from '../src/theme';

export default function Flag({
  flag,
  className,
  theme,
  toggleEvent,
}: {
  flag: string;
  className?: string;
  theme: Theme;
  toggleEvent?: (_: boolean) => void;
}) {
  const [toggled, setToggled] = useLocalStorage(`flag/${flag}`, false);

  useEffect(() => {
    if (toggleEvent) {
      toggleEvent(toggled);
    }
  }, [toggled, toggleEvent]);

  return (
    <div
      className={`${!!className ? className : ''}${theme.text.bg} ${
        theme.bg.primary
      } ${
        theme.font.main
      } border-black border rounded select-none p-1 mb-2 w-full flex flex-row`}
    >
      {toggled ? (
        <>
          {(() => {
            switch (flag) {
              default:
                return (
                  <span className={`${theme.font.alt} text-sm small-caps pl-3`}>
                    datastream origin ꡕꡖꡟꡣꡂ... connected. opening
                    kaathe.encyc.sim. retrieval success, displayed below.
                  </span>
                );
            }
          })()}
        </>
      ) : (
        <>
          <img src="/thessian.gif" alt="" className="w-36" />
          <div className="relative mt-2 pl-2">
            {(() => {
              switch (flag) {
                default:
                  return (
                    <>
                      <span>
                        <span className="semibold">Warning!</span> The enclosed
                        data is a class-D psychohazard and is restricted to
                        yellow ranked observers and above. Distribution to
                        unauthorized or somatic individuals is a direct
                        violation of Injunction 144-G, and may cause
                        significant, irreparable damage. By proceeding further
                        you affirm your complete privacy.
                      </span>
                      <button
                        className={`${theme.bg.soft} hover:bg-cyan-900 rounded absolute bottom-0 right-0 float-right p-2`}
                        onClick={() => setToggled(!toggled)}
                      >
                        Authenticate
                      </button>
                    </>
                  );
              }
            })()}
          </div>
        </>
      )}
    </div>
  );
}
