import Head from 'next/head';

const _404 = () => {
  return (
    <>
      <Head>
        <title>LEAVE NOW</title>
        <meta
          property="og:title"
          key="og:title"
          content={`F̸̦̯͙͖̼͊̒͒̓̀̕Ơ̸̻͙͈̞̤̤͋̽R̵̭̭̘͆͋́̃B̵̼̙̦̘͊̈́͗͝Į̶̻͇̥̹̈D̶͓̓̄̋̈́̇͘͠Ḑ̴͈̟̱̓͑͝È̵̛̱̼͈̯͎̖̮̾̈́̑̃͜Ǹ̸̢̝̰̉̋̄`}
        />
        <meta property="og:type" key="og:type" content="website" />
        <meta property="og:url" key="og:url" content={router.pathname} />
        <meta
          property="og:description"
          key="og:description"
          content="TURN BACK TURN BACK TURN BACK T̴U̴R̴N̷ ̶B̸A̴C̵K̶ T̶U̴R̸N̸ ̷B̷A̸C̴K̸ T̶U̸R̷N̴ ̴B̷A̵C̷K̸ T̸̮͌Ů̸̩Ŗ̸̿N̷̤͝ ̵̪̃B̵͓̀A̴͇̅C̸̞̾K̷̳̍  T̴̥̙̟̈́͗̚U̸͚̞̦͈͊̿́͠R̶̨͈̹͈̈́͝Ǹ̸̜ ̶̰̲͓̔̏͆B̵̝͙͆̀̀͌A̵̢̛̳̼C̵̠̖͍̏K̸̟͙̥͌̈́ T̷͔̟̙̞̩̍̎̓̏̊͠Ų̸̘̼̰̘̹̀R̴̡͎̭̀͘Ņ̸͉̻̇̀̽͋̾͠ ̷͓̩̻͖̪̼̀̑͒͝B̵̰͎̞̩̈́͛̇́̎͒A̸͖̫͔͍͍̎́̊͗ͅC̵̱̜͛̎̀̂̉Ḱ̶̨̹̯̅"
        />
      </Head>
      <div className="flex w-full h-full justify-center">
        <h2 className="place-self-center text-center text-2xl md:text-3xl mt-36 md:mt-10 text-crimson-500 font-semibold small-caps font-gelasio">
          nothing of note is located here.
        </h2>
        <img
          className="absolute mt-48 md:mt-0"
          src="/eye.webp"
          alt="NOCTIS SEES ALL. NOCTIS SEES YOU"
        />
      </div>
    </>
  );
};

export default _404;
