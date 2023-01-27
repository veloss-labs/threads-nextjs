import Layout from "~/components/Layout";
import { InferGetServerSidePropsType, GetServerSidePropsContext } from 'next';

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    props: {
      isMiddlewareHeaderSet: context.req.headers["x-hello-from-middleware1"] === "hello" ? "yes" : "no",
    },
  };
}

export default function Page({ isMiddlewareHeaderSet }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <Layout>
      <article>
        <h1>
          Middleware - set header
        </h1>
        <hr />
        <p>
          <b>Test 1:</b>
          Is middleware header set? {isMiddlewareHeaderSet}
        </p>
      </article>
    </Layout>
  );
}