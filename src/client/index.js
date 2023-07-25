// Import functions
import { tripInfo } from './js/updateUI';
import { timeToDep } from './js/tripCountdown';

// Import style files
import './styles/style.scss';

// Event listener to add function to existing HTML DOM element
document.getElementById('save-btn').addEventListener('click', tripInfo);

export { tripInfo, timeToDep }