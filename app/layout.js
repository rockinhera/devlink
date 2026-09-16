import '@mantine/core/styles.css';

import {
  ColorSchemeScript,
  MantineProvider,
} from '@mantine/core';

export const metadata = {
  title: 'DevLink',
  description: 'A developer resource hub',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript />
      </head>

      <body>
        <MantineProvider>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
} 