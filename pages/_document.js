import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet as StyledServerStyleSheet } from 'styled-components'
import { ServerStyleSheets as MuiServerStyleSheet } from '@material-ui/core/styles';
import theme from '../src/theme';

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
          {/* PWA primary color */}
          <meta name="theme-color" content={theme.palette.primary.main} />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const styledServerStyleSheet = new StyledServerStyleSheet();
  const muiServerStyleSheet = new MuiServerStyleSheet();
  const originalRenderPage = ctx.renderPage;

  try {
    ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => styledServerStyleSheet.collectStyles(muiServerStyleSheet.collect(<App {...props} />)),
    });

    const initialProps = await Document.getInitialProps(ctx);

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: (
        <>
          {initialProps.styles}
          {muiServerStyleSheet.getStyleElement()} 
          {styledServerStyleSheet.getStyleElement()}
        </>
      )
      // styles: [...React.Children.toArray(initialProps.styles), muiServerStyleSheet.getStyleElement(), styledServerStyleSheet.getStyleElement()],
    };
  } finally {
    styledServerStyleSheet.seal()
  }
};
