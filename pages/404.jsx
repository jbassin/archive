import Head from 'next/head';

const _404 = () => {
  return (
    <>
      <Head>
        <title>LEAVE NOW</title>
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
