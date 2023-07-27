import { clearElements } from '../src/client/js/removeTrip';

describe('clearElements', () => {
  test('should empty the innerHTML of specified elements', () => {
    // Create a mock DOM with jsdom
    const { JSDOM } = require('jsdom');
    const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    global.document = dom.window.document;

    // Create the elements you want to test with
    const elementsToTest = {
      tripCountdown: document.createElement('div'),
      cityInfo: document.createElement('div'),
      weatherInfo: document.createElement('div'),
      weatherDetails: document.createElement('div'),
      picInfo: document.createElement('div'),
    };

    // Add some inner HTML content to the elements for testing
    Object.values(elementsToTest).forEach((element, index) => {
      element.innerHTML = `Mocked content ${index}`;
    });

    // Append the elements to the document's body
    Object.values(elementsToTest).forEach((element) => {
      document.body.appendChild(element);
    });

    // Execute the clearElements function
    clearElements();

    // Check that the innerHTML of all elements is now empty
    Object.values(elementsToTest).forEach((element) => {
      expect(element.innerHTML).toBe('');
    });
  });
});