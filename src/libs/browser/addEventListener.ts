import ReactDOM from 'react-dom';

export function applyEventListener(
  target: any,
  eventType: any,
  cb: any,
  option: any,
) {
  const callback = ReactDOM.unstable_batchedUpdates
    ? function run(e: any) {
        ReactDOM.unstable_batchedUpdates(cb, e);
      }
    : cb;
  if (target.addEventListener) {
    target.addEventListener(eventType, callback, option);
  }
  return {
    remove: () => {
      if (target.removeEventListener) {
        target.removeEventListener(eventType, callback, option);
      }
    },
  };
}
