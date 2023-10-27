import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
  uniqueUsernameGenerator,
  nouns,
  adjectives,
  type Config,
} from 'unique-username-generator';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function optimizeAnimation(callback: () => void) {
  let ticking = false;

  return () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(() => {
        callback();
        ticking = false;
      });
    }
  };
}

export const generatorName = (seed: string) => {
  const marvelCharacters = [seed];

  const config: Config = {
    dictionaries: [adjectives, nouns, marvelCharacters],
    separator: '_',
    style: 'capital',
    randomDigits: 3,
  };

  const username: string = uniqueUsernameGenerator(config); // Hulk12
  return username;
};
