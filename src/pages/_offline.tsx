import React from 'react';
import Image from 'next/image';
import styles from '~/assets/css/modules/Home.module.css';
import Link from 'next/link';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>
          Get started by editing&nbsp;
          <code data-testid="code" className={styles.code}>
            pages/index.tsx
          </code>
        </p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{' '}
            <Image
              src="/images/vercel.svg"
              alt="Vercel Logo"
              className={styles.vercelLogo}
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      <div className={styles.center}>
        <Image
          className={styles.logo}
          src="/images/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image
            src="/images/thirteen.svg"
            alt="13"
            width={40}
            height={31}
            priority
          />
        </div>
      </div>

      <div className={styles.gap}></div>

      <div className={styles.grid}>
        <Link href="/" id="Home" className={styles.card} replace>
          <h2>
            Home <span>-&gt;</span>
          </h2>
          <p>Current Offline Fallback Page&nbsp; Go to Home Page</p>
        </Link>
      </div>
    </main>
  );
}
