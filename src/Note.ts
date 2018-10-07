import assert from './assert';
import Syntax from './parser/Syntax';

type Note = {
  pos?: Syntax.Pos,
  level: 'error' | 'warning' | 'info';
  tags: Note.Tag[],
  message: string;
  subnotes?: Note[];
};

function Note(
  el: { p?: Syntax.Pos },
  level: 'error' | 'warning' | 'info',
  tags: Note.Tag[],
  message: string,
  subnotes?: Note[],
) {
  const categories = ['syntax', 'validation', 'analysis', 'statistics'];
  const hasCategory = tags.some(t => categories.indexOf(t) !== -1);
  assert(hasCategory);

  for (const tag of tags) {
    if (!Note.isTag(tag)) {
      throw new Error('Unlisted tag: ' + tag);
    }
  }

  return {
    ...(el.p ? { pos: el.p } : {}),
    level,
    tags: [level, ...tags],
    message,
    ...(subnotes ? { subnotes } : {}),
  };
}

namespace Note {
  export type FileNote = Note & { file: string };

  export function flatten(notes: Note[]): Note[] {
    const newNotes: Note[] = [];

    for (const note of notes) {
      newNotes.push(note);

      if (note.subnotes) {
        newNotes.push(...flatten(note.subnotes));
      }
    }

    return newNotes;
  }

  export type Tag = (
    'error' |
    'warning' |
    'info' |
    'analysis' |
    'return-value' |
    'validation' |
    'no-effect' |
    'top-expression' |
    'control-flow' |
    'return-failure' |
    'empty-body' |
    'for-return' |
    'no-inner-return' |
    'control-clause-prevents-return' |
    'scope' |
    'not-found' |
    'unused' |
    'exception' |
    'value-needed' |
    'not-implemented' |
    'assert-false' |
    'type-error' |
    'operator' |
    'subexpression-mutation' |
    'is-duplicated' |
    'duplicate' |
    'object' |
    'duplicate-key' |
    'assigned' |
    'out-of-bounds' |
    'index-too-large' |
    'invalid-condition' |
    'for-loop' |
    'assert-non-bool' |
    'iteration-limit' |
    'assignment' |
    'statistics' |
    'compile-time' |
    'break-prevents-return' |
    'invalid-assignment-target' |
    'assign-target' |
    'unreachable' |
    'inc-dec' |
    'syntax' |
    'internal' |
    'object-multiplication' |
    'index-bad' |
    'subscript' |
    'call-non-function' |
    'arguments-length-mismatch' |
    'non-identifier-assignment-target' |
    'key-not-found' |
    'destructuring' |
    'destructuring-mismatch' |
    'length-mismatch' |
    'non-identifier-creation-target' |
    'non-bool-condition' |
    'if' |
    'assert' |
    'object-subscript' |
    'unary-plus-minus' |
    never
  );

  export const tags: Note.Tag[] = [
    'error',
    'warning',
    'info',
    'analysis',
    'return-value',
    'validation',
    'no-effect',
    'top-expression',
    'control-flow',
    'return-failure',
    'empty-body',
    'for-return',
    'no-inner-return',
    'control-clause-prevents-return',
    'scope',
    'not-found',
    'unused',
    'exception',
    'value-needed',
    'not-implemented',
    'assert-false',
    'type-error',
    'operator',
    'subexpression-mutation',
    'is-duplicated',
    'duplicate',
    'object',
    'duplicate-key',
    'assigned',
    'out-of-bounds',
    'index-too-large',
    'invalid-condition',
    'for-loop',
    'assert-non-bool',
    'iteration-limit',
    'assignment',
    'statistics',
    'compile-time',
    'break-prevents-return',
    'invalid-assignment-target',
    'assign-target',
    'unreachable',
    'inc-dec',
    'syntax',
    'internal',
    'object-multiplication',
    'index-bad',
    'subscript',
    'call-non-function',
    'arguments-length-mismatch',
    'non-identifier-assignment-target',
    'key-not-found',
    'destructuring',
    'destructuring-mismatch',
    'length-mismatch',
    'non-identifier-creation-target',
    'non-bool-condition',
    'if',
    'assert',
    'object-subscript',
    'unary-plus-minus',
  ];

  export const isTag = memberTestFromArray<Tag>(tags);
}

function memberTestFromArray<K extends string>(
  items: K[]
): ((key: string) => key is K) {
  const dict: { [key: string]: true | undefined } = {};

  for (const item of items) {
    if (dict[item]) {
      throw new Error('duplicate item when generating test: ' + item);
    }

    dict[item] = true;
  }

  return (key => Boolean(dict[key])) as ((key: string) => key is K);
}

export default Note;
