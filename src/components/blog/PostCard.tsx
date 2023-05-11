import React from 'react';

export default function PostCard() {
  return (
    <div className="py-8 border-t border-gray-200 grid sm:grid-cols-3 gap-2">
      <div className="w-56 text-gray-500">
        <p>
          <time dateTime="2023-05-04T11:30:00.000Z">May 4, 2023</time>
        </p>
        <div className="flow-root mt-8 text-sm text-gray-400">
          <div className="-m-2 flex flex-wrap">
            <a
              className="m-2 hover:text-blue-500 hover:underline"
              href="/blog?tag=engineering"
            >
              Engineering
            </a>
            <a
              className="m-2 hover:text-blue-500 hover:underline"
              href="/blog?tag=how-to"
            >
              {' '}
              How To
            </a>
          </div>
        </div>
      </div>
      <a
        className="sm:col-span-2"
        href="/blog/roll-your-own-javascript-runtime-pt3"
      >
        <h3 className="text-2xl text-gray-800 font-bold font-display">
          Roll your own JavaScript runtime, pt. 3
        </h3>
        <div className="mt-4 text-gray-800">
          {`We'll create and load a snapshot of our custom JavaScript runtime to
          optimize startup time.`}
        </div>
      </a>
    </div>
  );
}
