import React from 'react';
import { ScrollStory } from './components/ScrollStory';

/**
 * App — single-page editorial experience.
 * All sections (hero, story, board, stats) live inside ScrollStory.
 * No view toggling needed; the board is embedded inline.
 */
export default function App() {
  return <ScrollStory />;
}
