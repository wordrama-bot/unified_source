import * as changeKeys from 'change-case/keys';

import { db } from '../models';

async function getWord(word: string) {
  const { data, error } = await db
    .from('_dictionary')
    .select('word, definition')
    .eq('word', word)
    .maybeSingle();

  if (error) {
    console.error(error);
    return {};
  }

  if (data) {
    return changeKeys.camelCase(data, 10);
  } else {
    const definition = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    ).then((res) => res.json());

    if (definition.title === 'No Definitions Found') return {};
    if (definition.length < 1) return {};

    const { data: newEntry, error: insertError } = await db
      .from('_dictionary')
      .insert({ word, definition })
      .select('word, definition')
      .maybeSingle();

    if (insertError) {
      console.error(insertError);
      return {};
    }

    // Return the new entry
    return changeKeys.camelCase(newEntry, 10);
  }
}

async function searchWord(query: string) {
  const { data, error } = await db
    .from('_dictionary')
    .select('word, definition')
    .textSearch('word', `'${query}'`, {
      type: 'websearch',
    })
    .limit(10);

  if (error) {
    console.error(error);
    return {};
  }

  return data.map((entry) => changeKeys.camelCase(entry, 10));
}

async function getStartsWith(letter: string) {
  const { data, error } = await db
    .from('_dictionary')
    .select('word')
    .like('word', `${letter}%`);

  if (error) {
    console.error(error);
    return {};
  }

  return data;
}

async function getAllWords() {
  const { data, error } = await db.from('_dictionary').select('word');

  if (error) {
    console.error(error);
    return {};
  }

  return data.map(({ word }) => word);
}

export default {
  getWord,
  searchWord,
  getStartsWith,
  getAllWords,
};
