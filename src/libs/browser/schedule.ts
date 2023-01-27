// 렌더링 후 상태 업데이트를 예약하는 데 사용되는 함수
export function scheduleMicrotask(callback: () => void): void {
  Promise.resolve()
    .then(callback)
    .catch((error) =>
      setTimeout(() => {
        throw error;
      }),
    );
}
