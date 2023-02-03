import React from 'react';
import Layout from '~/components/Layout';
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';
import { isEmpty } from '~/utils/assertion';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (isEmpty(context.query)) {
    return {
      props: {
        qs: 'No query string',
      },
    };
  }
  return {
    props: {
      qs: JSON.stringify(context.query),
    },
  };
}

export default function Page({
  qs,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <article>
        <h1>Middleware - geolocation</h1>
        <hr />
        <p>
          <b>Test 1:</b>
          URL query contains country, city, and region: {qs}
        </p>
      </article>
    </Layout>
  );
}
