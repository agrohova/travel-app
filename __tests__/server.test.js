import { checkURL } from '../src/client/js/checkURL'

describe('checkURL function', () => {
  it('should return true for valid URL', () => {
    const validURL = 'https://www.example.com';
    expect(checkURL(validURL)).toBe(true);
  });

  it('should return true for valid URL again', () => {
    const anotherValidURL = 'http://subdomain.example.com/page';
    expect(checkURL(anotherValidURL)).toBe(true);
  });

  it('should return false for invalid URL', () => {
    const invalidURL = 'not_a_valid_url';
    expect(checkURL(invalidURL)).toBe(false);
  });

  it('should return false for empty string', () => {
    const emptyString = '';
    expect(checkURL(emptyString)).toBe(false);
  });
});