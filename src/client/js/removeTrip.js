function clearElements(document) {
  const elementsToEmpty = [
    'tripCountdown',
    'cityInfo',
    'weatherInfo',
    'weatherDetails',
    'picInfo'
  ];

  // for each element, empty the inner HTML
  elementsToEmpty.forEach(elementId => {
    const element = document.getElementById(elementId);
    element.innerHTML = '';
  });
}

export { clearElements }