import React from 'react';
import Layout from '~/components/Layout';
import type { InferGetServerSidePropsType } from 'next';
import { ApiService } from '~/api/client';
import { useQuery } from '@tanstack/react-query';

export async function getServerSideProps() {
  const resp = await ApiService.getJson<{ csrfToken: string }>('csrf');
  return {
    props: {
      csrfToken: resp.csrfToken,
    },
  };
}

export default function Page({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useQuery([ApiService.APPLICATION_API.csrf], async (key) => {
    const path = key.queryKey.at(0);
    if (!path) return null;
    const resp = await ApiService.getJson<{ csrfToken: string }>(path);
    return resp.csrfToken;
  });

  console.log('data', data);

  return (
    <Layout>
      <article>
        <h1>Web Standards</h1>
        <hr />
        <p>
          <b>Test 1:</b>
          SSR (Lambda@Edge) or (Lambda) should have get the CSRF token in the
          response data. CSRF_TOKEN: <br />
          {/* 말줄임 표시 */}
          <span
            style={{
              display: 'inline-block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {csrfToken}
          </span>
        </p>
        <br />
        <p>
          <b>Test 2:</b>
          CSR should have get the CSRF token in the response data. CSRF_TOKEN:{' '}
          <br />
          {/* 말줄임 표시 */}
          <span
            style={{
              display: 'inline-block',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {data}
          </span>
        </p>
      </article>
    </Layout>
  );
}
