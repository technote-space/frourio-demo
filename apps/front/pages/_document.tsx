import { ColorModeScript } from '@chakra-ui/react';
import NextDocument, { Html, Head, Main, NextScript } from 'next/document';

const getLicenseUrl = () => `${process.env.BASE_PATH}/license.json`;
export default class Document extends NextDocument {
  render() {
    return <Html lang="ja">
      <head dangerouslySetInnerHTML={{ __html: `<!-- Licenses: ${getLicenseUrl()} -->` }}>
      </head>
      <Head/>
      <body>
        <ColorModeScript initialColorMode="system"/>
        <Main/>
        <NextScript/>
      </body>
    </Html>;
  }
}
