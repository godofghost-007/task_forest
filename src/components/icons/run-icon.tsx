import * as React from 'react';

export const RunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M13 4a2 2 0 1 0-4 0 2 2 0 0 0 4 0z" />
    <path d="m7.4 12.1 2.5-1.8" />
    <path d="m14.1 10.3 2.5 1.8" />
    <path d="M12.4 21.8 10 16l-1.5 1.5" />
    <path d="m7.9 14.5 1.5-1.5" />
    <path d="M15.5 13H17l2 4-3 1-1.5-2z" />
  </svg>
);
