import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

const refs = {
    startBtn: document.querySelector('button[data-start]'),
    onInput: document.querySelector('#datetime-picker'),
    days: document.querySelector('[data-days]'),
    hours: document.querySelector('[data-hours]'),
    minutes: document.querySelector('[data-minutes]'),
    seconds: document.querySelector('[data-seconds]'),
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const choiceDay = selectedDates[0].getTime();
        if (Date.now() >= choiceDay) {
            window.alert("Please choose a date in the future")
        }
        else {
            refs.startBtn.disabled = false;
        }
        refs.startBtn.addEventListener('click', () => {
            refs.startBtn.disabled = true;
            timerId = setInterval(() => {
                const delta = choiceDay - Date.now()
                if (delta <= 0) {
                    clearInterval(timerId);
                    return
                }
                else {
                    updateClocks(convertMs(delta))
                }
            }, 1000);
        })

    },

};
flatpickr(refs.onInput, options);


let timerId = null

function addLeadingZero(value) {
    return String(value).padStart(2, '0')
}

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = addLeadingZero(Math.floor(ms / day));
    const hours = addLeadingZero(Math.floor((ms % day) / hour));
    const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
    const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));
    return { days, hours, minutes, seconds };
}

function updateClocks({ days, hours, minutes, seconds }) {
    refs.days.textContent = `${days}`;
    refs.hours.textContent = `${hours}`;
    refs.minutes.textContent = `${minutes}`;
    refs.seconds.textContent = `${seconds}`;
}
