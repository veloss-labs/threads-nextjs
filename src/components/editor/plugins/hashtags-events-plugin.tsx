import { NodeEventPlugin } from '@lexical/react/LexicalNodeEventPlugin';
import type { LexicalEditor } from 'lexical';
import HashTagNode from '~/components/editor/nodes/hashtag-node';

interface HashtagsEventsPluginProps {
  eventListener: (event: Event, editor: LexicalEditor, nodeKey: string) => void;
}

export default function HashtagsEventsPlugin({
  eventListener,
}: HashtagsEventsPluginProps) {
  return (
    <NodeEventPlugin
      nodeType={HashTagNode}
      eventType={'click'}
      eventListener={eventListener}
    />
  );
}
