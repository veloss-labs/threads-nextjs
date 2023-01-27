import Layout from '~/components/Layout';
import { InferGetServerSidePropsType } from 'next';

export async function getServerSideProps() {
  console.log('SSR - Server Side Rendering - getServerSideProps()');
  return {
    notFound: true,
  };
}

export default function Page(
  props: InferGetServerSidePropsType<typeof getServerSideProps>,
) {
  return (
    <Layout>
      <article>
        <h1>SSR - Server Side Rendering</h1>
        <hr />
        <p>
          <b>Test 1:</b>
          If you see this page, SSR with redirect is NOT working. You should be
          redirected to /ssr-redirect-destination.
        </p>
      </article>
    </Layout>
  );
}
