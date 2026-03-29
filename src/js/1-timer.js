const startBtn = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEl = document.querySelector('[data-seconds]');

let userSelectedDate;
let intervalId;

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function updateUI({ days, hours, minutes, seconds }) {
  daysEl.textContent = addZero(days);
  hoursEl.textContent = addZero(hours);
  minutesEl.textContent = addZero(minutes);
  secondsEl.textContent = addZero(seconds);
}

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const chosen = selectedDates[0];

    if (chosen <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });
      userSelectedDate = null;
      startBtn.disabled = true;
    } else {
      userSelectedDate = chosen;
      startBtn.disabled = false;
    }
  },
};

flatpickr('#datetime-picker', options);

document.addEventListener('click', (event) => {
  const startButton = event.target.closest('[data-start]');

  if (!startButton) return;
  if (startButton.disabled) return;
  if (!userSelectedDate) return;

  startButton.disabled = true;
  document.querySelector('#datetime-picker').disabled = true;

  clearInterval(intervalId);

  intervalId = setInterval(() => {
    const ms = userSelectedDate - new Date();

    if (ms <= 0) {
      clearInterval(intervalId);
      updateUI({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      document.querySelector('#datetime-picker').disabled = false;
      iziToast.success({
        title: 'Done!',
        message: 'Countdown finished!',
        position: 'topRight',
      });
      return;
    }

    updateUI(convertMs(ms));
  }, 1000);
});

function addZero(value) {
  return String(value).padStart(2, '0');
}