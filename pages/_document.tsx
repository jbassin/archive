import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head />
      <body
        className="bg-background-500"
        style={{
          backgroundImage: 'url(http://scribe.pf2.tools/assets/paper.jpg)',
        }}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
