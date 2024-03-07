import {
  type Spread,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  $applyNodeReplacement,
  TextNode,
  type DOMExportOutput,
  type DOMConversionMap,
  type DOMConversionOutput,
} from 'lexical';

export type SerializedHashTagNode = Spread<
  {
    hashtagName: string;
  },
  SerializedTextNode
>;

function convertHashtagElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createHashTagNode(textContent);
    return {
      node,
    };
  }

  return null;
}

export default class HashTagNode extends TextNode {
  __hashtag: string;

  static getType(): string {
    return 'hashtag';
  }

  static clone(node: HashTagNode): HashTagNode {
    return new HashTagNode(node.__hashtag, node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedHashTagNode): HashTagNode {
    const node = $createHashTagNode(serializedNode.hashtagName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(hashtagName: string, text?: string, key?: NodeKey) {
    super(text ?? hashtagName, key);
    this.__hashtag = hashtagName;
  }

  exportJSON(): SerializedHashTagNode {
    return {
      ...super.exportJSON(),
      hashtagName: this.__hashtag,
      type: 'hashtag',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.dataset.type = 'hashtag';
    dom.className =
      'js-lexical-hashtag font-medium text-blue-400 underline underline-offset-4';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-hashtag', 'true');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-hashtag')) {
          return null;
        }
        return {
          conversion: convertHashtagElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export function $createHashTagNode(mentionName: string): HashTagNode {
  const hashtagNode = new HashTagNode(mentionName);
  hashtagNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(hashtagNode);
}

export function $isHashTagNode(
  node: LexicalNode | null | undefined,
): node is HashTagNode {
  return node instanceof HashTagNode;
}
