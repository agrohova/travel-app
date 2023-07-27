// Import functions
import { tripInfo, todaysDate, timeToDep, updateUI } from './js/tripInfo';
import { clearElements } from './js/removeTrip'

// Import style files
import './styles/style.scss';

// Event listener to add function to existing HTML DOM element
document.getElementById('save-btn').addEventListener('click', tripInfo);

export { tripInfo, updateUI, todaysDate, timeToDep, clearElements }