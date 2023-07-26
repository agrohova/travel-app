// Import functions
import { tripInfo, updateUI, timeToDep } from './js/updateUI';

// Import style files
import './styles/style.scss';

// Event listener to add function to existing HTML DOM element
document.getElementById('save-btn').addEventListener('click', tripInfo);

export { tripInfo, updateUI, timeToDep }