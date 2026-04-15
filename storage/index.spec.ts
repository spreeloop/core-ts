import * as index from './index';

// Ensure that we import all exported functions,
// in order to have more accurate code coverage stats.
describe('Import all functions', () => {
  it('ensures that the index is defined', () => {
    expect(index).toBeDefined();
  });
});
