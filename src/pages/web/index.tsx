import React from 'react';
import Layout from '~/components/Layout';
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';

import { getCsrfApi } from '~/api/services/app/mock';
import { useCsrfQuery } from '~/api/services/hook/mock';

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const csrfToken = await getCsrfApi({
    ctx,
  });
  return {
    props: {
      csrfToken,
    },
  };
}

export default function Page({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { data } = useCsrfQuery({
    initialData: csrfToken,
  });

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
