// Import functions
import { tripInfo } from './js/updateUI';
import { timetoDep } from './js/tripCountdown';

// Import SASS files
import './styles/style.scss';

// Event listener to add function to existing HTML DOM element
document.getElementById('save-btn').addEventListener('click', planTrip);

export { tripInfo, timetoDep }