import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import { TextNode } from 'lexical';
import React, { useCallback, useDeferredValue, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Icons } from '~/components/icons';
import { getTargetElement } from '~/libs/browser/dom';
import { api } from '~/services/trpc/react';
import { cn } from '~/utils/utils';
import { $createHashTagNode } from '~/components/editor/nodes/hashtag-node';
import { buttonVariants } from '~/components/ui/button';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['#'].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignHashTagsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignHashTagsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

function useHashTagsLookupService(mentionString: string | null) {
  const utils = api.useUtils();

  const mutation = api.tags.create.useMutation({
    async onSuccess(data) {
      if (data) {
        await utils.tags.getMentionTags.invalidate();
      }
    },
  });

  const { data, isLoading } = api.tags.getMentionTags.useQuery(
    {
      keyword: mentionString ?? undefined,
    },
    {
      enabled: Boolean(mentionString),
      staleTime: 2 * 60 * 1000,
    },
  );

  return {
    data,
    isLoading,
    mutation,
  };
}

function checkForAtSignHashTags(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignHashTagsRegex.exec(text);

  if (match === null) {
    match = AtSignHashTagsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (!matchingString) {
      return null;
    }

    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + (maybeLeadingWhitespace?.length ?? 0),
        matchingString,
        replaceableString: match[2] ?? '',
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignHashTags(text, 1);
}

interface HashTagTypeaheadOptionParams {
  tagId?: string;
  tagName: string;
  type: 'remote' | 'input';
}

class HashTagTypeaheadOption extends MenuOption {
  tagId?: string;
  name: string;
  type: 'remote' | 'input' = 'remote';

  constructor(params: HashTagTypeaheadOptionParams) {
    super(params.tagName);
    this.tagId = params.tagId;
    this.name = params.tagName;
    this.type = params.type;
  }
}

interface HashTagTypeaheadMenuItemProps {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: HashTagTypeaheadOption;
}

function HashTagsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: HashTagTypeaheadMenuItemProps) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={cn(
        'relative flex cursor-default select-none items-center space-x-3 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50',
        {
          'dark:bg-slate-800 dark:text-slate-50 bg-slate-100 text-slate-900':
            isSelected,
        },
      )}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div>
        <p className="m-0 block max-w-full truncate font-semibold">
          {option.name}
        </p>
      </div>
    </li>
  );
}

function HashTagsTypeaheadRegisterMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: HashTagTypeaheadMenuItemProps) {
  return (
    <li
      key={option.key}
      tabIndex={-1}
      className={cn(
        'relative flex cursor-default select-none items-center space-x-3 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-slate-800 dark:focus:text-slate-50',
        {
          'dark:bg-slate-800 dark:text-slate-50 bg-slate-100 text-slate-900':
            isSelected,
        },
      )}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
    >
      <div className="flex flex-col">
        <p className="m-0 block max-w-full truncate text-lg font-semibold">
          {option.name}
        </p>
        <div
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm', className: 'p-0' }),
          )}
        >
          <Icons.add className="size-4" />
          새로운 주제 태그하기
        </div>
      </div>
    </li>
  );
}

export default function NewHashTagsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);

  const deferredQueryString = useDeferredValue(queryString);

  const { data, isLoading, mutation } =
    useHashTagsLookupService(deferredQueryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(() => {
    const hashTags: HashTagTypeaheadOption[] = [];
    const typesafeData = data ?? [];
    if (deferredQueryString) {
      hashTags.push(
        new HashTagTypeaheadOption({
          tagId: undefined,
          tagName: deferredQueryString,
          type: 'input',
        }),
      );
    }

    for (const listItem of typesafeData) {
      hashTags.push(
        new HashTagTypeaheadOption({
          tagId: listItem.id,
          tagName: listItem.name,
          type: 'remote',
        }),
      );
    }
    return hashTags;
  }, [data, deferredQueryString]);

  const onSelectOption = useCallback(
    (
      selectedOption: HashTagTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        const hashTagNode = $createHashTagNode(selectedOption.name);
        if (nodeToReplace) {
          nodeToReplace.replace(hashTagNode);
        }
        hashTagNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );

  return (
    <LexicalTypeaheadMenuPlugin<HashTagTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex },
      ) => {
        const ele = getTargetElement(anchorElementRef);
        const isOpen = Boolean(ele);

        if (isOpen) {
          return ReactDOM.createPortal(
            <div className="relative" role="dialog">
              <div className="z-50 min-w-[16rem] overflow-hidden rounded-md border border-slate-200 bg-white p-1 text-slate-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50">
                {isLoading ? (
                  <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
                    <Icons.spinner className="mr-2 size-8 animate-spin" />
                  </div>
                ) : (
                  <ul>
                    {options.map((option, i: number) => {
                      if (option.type === 'input') {
                        return (
                          <HashTagsTypeaheadRegisterMenuItem
                            index={i}
                            isSelected={selectedIndex === i}
                            onClick={() => {
                              setHighlightedIndex(i);
                              selectOptionAndCleanUp(option);
                              mutation.mutate({
                                name: option.name,
                              });
                            }}
                            onMouseEnter={() => {
                              setHighlightedIndex(i);
                            }}
                            key={`${option.key}-${option.type}`}
                            option={option}
                          />
                        );
                      }
                      return (
                        <HashTagsTypeaheadMenuItem
                          index={i}
                          isSelected={selectedIndex === i}
                          onClick={() => {
                            setHighlightedIndex(i);
                            selectOptionAndCleanUp(option);
                          }}
                          onMouseEnter={() => {
                            setHighlightedIndex(i);
                          }}
                          key={`${option.key}-${option.type}`}
                          option={option}
                        />
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>,
            ele as Element,
          );
        }
        return null;
      }}
    />
  );
}
