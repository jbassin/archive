import { useLocalStorage } from '../src/local_storage';
import { Theme } from '../src/theme';

export default function Flag({
  flag,
  className,
  theme,
}: {
  flag: string;
  className?: string;
  theme: Theme;
}) {
  const [toggled, setToggled] = useLocalStorage(`flag/${flag}`, true);

  return (
    <div
      className={`${!!className ? className : ''}${theme.text.bg} ${
        theme.bg.primary
      } ${
        theme.font.main
      } border-black border rounded cursor-pointer select-none p-1 mb-2 w-full flex flex-row`}
      onClick={() => setToggled(!toggled)}
    >
      {toggled ? (
        <>
          <img src="/thessian.gif" alt="" className="w-36" />
          <div className="mt-2 pl-2">
            {(() => {
              switch (flag) {
                default:
                  return (
                    <span>
                      Warning! Access to enclosed data is restricted to class
                      green observers and above. Distribution to unauthorized or
                      somatic individuals is a direct violation of Injunction
                      144-D. By proceeding further you affirm
                    </span>
                  );
              }
            })()}
          </div>
        </>
      ) : (
        <>
          {(() => {
            switch (flag) {
              default:
                return (
                  <span className={`${theme.font.alt} text-sm small-caps pl-3`}>
                    datastream origin ꡕꡖꡟꡣꡂ... connected. opening
                    kathe.encyc.sim. retrieval success, displayed below.
                  </span>
                );
            }
          })()}
        </>
      )}
    </div>
  );
}
