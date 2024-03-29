'use client';

import ErrorPage from '~/components/error/error-page';

export default function NotFound() {
  return (
    <ErrorPage
      status={404}
      title="죄송합니다. 페이지를 이용할 수 없습니다"
      description="클릭하신 링크가 잘못되었거나 페이지가 삭제되었을 수 있습니다."
    />
  );
}
