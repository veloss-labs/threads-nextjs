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
              src="/vercel.svg"
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
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
        </div>
      </div>

      <div className={styles.gap}></div>

      <div className={styles.grid}>
        <Link href="/ssr" id="ssr" className={styles.card}>
          <h2>
            SSR <span>-&gt;</span>
          </h2>
          <p>Server Side Rendering Page</p>
        </Link>
        <Link href="/ssr-redirect" id="ssr redirect" className={styles.card}>
          <h2>
            SSR Redirect<span>-&gt;</span>
          </h2>
          <p>Server Side Rendering Page with Redirect</p>
        </Link>
        <Link href="/ssr-not-found" id="ssr not found" className={styles.card}>
          <h2>
            SSR NotFound<span>-&gt;</span>
          </h2>
          <p>Server Side Rendering Page with NotFound</p>
        </Link>
        <Link href="/image-html-tag" id="img html tag" className={styles.card}>
          <h2>
            Image Html Tag<span>-&gt;</span>
          </h2>
          <p>Image Html Tag</p>
        </Link>
        <Link
          href="/image-optimization-imported"
          id="image optimization imported"
          className={styles.card}
        >
          <h2>
            Image Optimization Imported<span>-&gt;</span>
          </h2>
          <p>
            Image Optimization imported from&nbsp;
            <code className={styles['code-sm']}>public/images</code>
          </p>
        </Link>
        <Link
          href="/image-optimization-remote"
          id="image optimization remote"
          className={styles.card}
        >
          <h2>
            Image Optimization Remote<span>-&gt;</span>
          </h2>
          <p>
            Image Optimization remote from&nbsp;
            <code className={styles['code-sm']}>
              https://images.unsplash.com
            </code>
          </p>
        </Link>
        <Link
          href="/middleware-redirect"
          id="middleware redirect"
          className={styles.card}
        >
          <h2>
            Middleware Redirect<span>-&gt;</span>
          </h2>
          <p>
            Middleware Redirect to&nbsp;
            <code className={styles['code-sm']}>
              /middleware-redirect-destination
            </code>
          </p>
        </Link>
        <Link
          href="/middleware-set-header"
          id="middleware set header"
          className={styles.card}
        >
          <h2>
            Middleware Set Header<span>-&gt;</span>
          </h2>
          <p>Middleware Set Header</p>
        </Link>
        <Link
          href="/middleware-geolocation"
          id="middleware geolocation"
          className={styles.card}
        >
          <h2>
            Middleware Geolocation<span>-&gt;</span>
          </h2>
          <p>Middleware Geolocation</p>
        </Link>
        <Link
          href="/middleware-rewrite"
          id="middleware rewrite"
          className={styles.card}
        >
          <h2>
            Middleware Rewrite<span>-&gt;</span>
          </h2>
          <p>Middleware Rewrite</p>
        </Link>
        <Link href="/ssg" id="ssg" className={styles.card}>
          <h2>
            SSG<span>-&gt;</span>
          </h2>
          <p>Static Site Generation Page</p>
        </Link>
        <Link href="/ssg-dynamic/1" id="ssg dynamic" className={styles.card}>
          <h2>
            SSG Dynamic<span>-&gt;</span>
          </h2>
          <p>
            Static Site Generation Page with Dynamic Route&nbsp;
            <code className={styles['code-sm']}>[id].tsx</code>
          </p>
        </Link>
        <Link
          href="/ssg-dynamic-fallback/1"
          id="ssg dynamic fallback"
          className={styles.card}
        >
          <h2>
            SSG Dynamic Fallback<span>-&gt;</span>
          </h2>
          <p>
            Static Site Generation Page with Dynamic Route&nbsp;
            <code className={styles['code-sm']}>[id].tsx</code>
            &nbsp;and fallback
          </p>
        </Link>
      </div>
    </main>
  );
}
