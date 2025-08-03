
import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { TaskProvider } from '@/context/task-context';
import { ThemeProvider } from '@/context/theme-context';

export const metadata: Metadata = {
  title: 'Task Forest',
  description: 'Gamify your tasks and build your own forest.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={cn('font-body antialiased')}>
        <ThemeProvider>
            <TaskProvider>
                {children}
            </TaskProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
