import type { GetStaticPropsContext, InferGetStaticPropsType } from 'next';
import React from 'react';
import Layout from '~/components/Layout';

const posts = [
  {
    id: '1',
    title: 'First post',
  },
];

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: true,
  };
}

export function getStaticProps({ params }: GetStaticPropsContext) {
  return {
    props: {
      data: posts.find(({ id }) => id === params?.id),
      time: Date.now(),
    },
  };
}

export default function Post({
  data,
  time,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Layout>
      <article>
        <h1>Static Site Generation with dynamic route fallback</h1>
        <hr />
        <p>
          <b>Test 1:</b>
          This timestamp 👉 {time} should be when the `npx open-next build` was
          run, not when the page is refreshed. Hence, this time should not
          change on refresh.js
        </p>
        <p>
          <b>Test 2:</b>
          {`This string 👉 "${data?.title}" should be "First post"`}
        </p>
        <p>
          <b>Test 3:</b>
          {`Check your browser's developer console. First request might show cache
          MISS on first load. Subsequent refreshes should shows cache HIT.`}
        </p>
      </article>
    </Layout>
  );
}
