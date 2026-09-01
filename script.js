class TimezoneClock {
    constructor() {
        this.clocks = [];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromLocalStorage();
        this.startUpdateLoop();
    }

    setupEventListeners() {
        const addBtn = document.getElementById('addBtn');
        const timezoneInput = document.getElementById('timezoneInput');

        addBtn.addEventListener('click', () => this.addClock());
        timezoneInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addClock();
        });

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tz = e.target.dataset.tz;
                this.addClockForTimezone(tz);
            });
        });
    }

    addClock() {
        const input = document.getElementById('timezoneInput');
        const timezone = input.value.trim();

        if (!timezone) {
            this.showMessage('Please enter a timezone', 'error');
            return;
        }

        this.addClockForTimezone(timezone);
        input.value = '';
    }

    addClockForTimezone(timezone) {
        // Validate timezone
        if (!this.isValidTimezone(timezone)) {
            this.showMessage(`Invalid timezone: ${timezone}`, 'error');
            return;
        }

        // Check if already added
        if (this.clocks.find(c => c.timezone === timezone)) {
            this.showMessage(`${timezone} is already added`, 'error');
            return;
        }

        const clockData = {
            id: Date.now(),
            timezone: timezone
        };

        this.clocks.push(clockData);
        this.renderClock(clockData);
        this.saveToLocalStorage();
        this.showMessage(`Added ${timezone}`, 'success');
    }

    isValidTimezone(timezone) {
        try {
            new Intl.DateTimeFormat('en-US', { timeZone: timezone });
            return true;
        } catch (error) {
            return false;
        }
    }

    renderClock(clockData) {
        const grid = document.getElementById('timezonesGrid');
        const clockCard = document.createElement('div');
        clockCard.className = 'clock-card';
        clockCard.id = `clock-${clockData.id}`;

        clockCard.innerHTML = `
            <div class="timezone-name">${this.getDisplayName(clockData.timezone)}</div>
            <div class="timezone-offset">${this.getTimezoneOffset(clockData.timezone)}</div>
            <div class="digital-time" id="digital-${clockData.id}">00:00:00</div>
            <div class="time-format" id="format-${clockData.id}">--</div>
            <div class="date-display" id="date-${clockData.id}">--</div>
            
            <div class="analog-clock" id="analog-${clockData.id}">
                <div class="hand hour-hand" id="hour-${clockData.id}" style="transform: rotate(0deg);"></div>
                <div class="hand minute-hand" id="minute-${clockData.id}" style="transform: rotate(0deg);"></div>
                <div class="hand second-hand" id="second-${clockData.id}" style="transform: rotate(0deg);"></div>
                <div class="clock-center"></div>
                <div class="clock-numbers" id="numbers-${clockData.id}"></div>
            </div>

            <button class="remove-btn" onclick="timezoneClock.removeClock(${clockData.id})">Remove</button>
        `;

        grid.appendChild(clockCard);
        this.addClockNumbers(`numbers-${clockData.id}`);
        this.updateClock(clockData.id);
    }

    addClockNumbers(numbersId) {
        const container = document.getElementById(numbersId);
        for (let i = 1; i <= 12; i++) {
            const number = document.createElement('div');
            number.className = 'number';
            number.textContent = i;
            const angle = (i - 3) * 30;
            const x = 85 * Math.cos((angle * Math.PI) / 180);
            const y = 85 * Math.sin((angle * Math.PI) / 180);
            number.style.left = `calc(50% + ${x}px)`;
            number.style.top = `calc(50% + ${y}px)`;
            number.style.transform = 'translate(-50%, -50%)';
            container.appendChild(number);
        }
    }

    updateClock(clockId) {
        const clockData = this.clocks.find(c => c.id === clockId);
        if (!clockData) return;

        const timezone = clockData.timezone;
        const now = new Date();

        // Get time in specific timezone
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        const parts = formatter.formatToParts(now);
        const hour = parseInt(parts.find(p => p.type === 'hour').value);
        const minute = parseInt(parts.find(p => p.type === 'minute').value);
        const second = parseInt(parts.find(p => p.type === 'second').value);

        // Update digital time
        const digitalTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')}`;
        const digitalEl = document.getElementById(`digital-${clockId}`);
        if (digitalEl) digitalEl.textContent = digitalTime;

        // Update time format (AM/PM)
        const is24Hour = true;
        const formatEl = document.getElementById(`format-${clockId}`);
        if (formatEl) {
            formatEl.textContent = is24Hour ? '24-hour format' : (hour >= 12 ? 'PM' : 'AM');
        }

        // Update date
        const dateFormatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
        const dateEl = document.getElementById(`date-${clockId}`);
        if (dateEl) dateEl.textContent = dateFormatter.format(now);

        // Update analog clock hands
        this.updateAnalogClock(clockId, hour, minute, second);
    }

    updateAnalogClock(clockId, hour, minute, second) {
        // Calculate degrees
        const secondDegrees = (second / 60) * 360;
        const minuteDegrees = (minute / 60) * 360 + (second / 60) * 6;
        const hourDegrees = (hour % 12 / 12) * 360 + (minute / 60) * 30 + (second / 3600) * 0.5;

        // Update hands
        const hourHand = document.getElementById(`hour-${clockId}`);
        const minuteHand = document.getElementById(`minute-${clockId}`);
        const secondHand = document.getElementById(`second-${clockId}`);

        if (hourHand) hourHand.style.transform = `rotate(${hourDegrees}deg)`;
        if (minuteHand) minuteHand.style.transform = `rotate(${minuteDegrees}deg)`;
        if (secondHand) secondHand.style.transform = `rotate(${secondDegrees}deg)`;
    }

    startUpdateLoop() {
        setInterval(() => {
            this.clocks.forEach(clock => this.updateClock(clock.id));
        }, 1000);
    }

    removeClock(clockId) {
        const index = this.clocks.findIndex(c => c.id === clockId);
        if (index > -1) {
            this.clocks.splice(index, 1);
            const element = document.getElementById(`clock-${clockId}`);
            if (element) {
                element.style.animation = 'scaleIn 0.5s ease-out reverse';
                setTimeout(() => element.remove(), 500);
            }
            this.saveToLocalStorage();
        }
    }

    getDisplayName(timezone) {
        return timezone.replace(/_/g, ' ').split('/').pop();
    }

    getTimezoneOffset(timezone) {
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            timeZoneName: 'short'
        });

        const parts = formatter.formatToParts(new Date());
        const tzName = parts.find(p => p.type === 'timeZoneName')?.value || timezone;

        // Calculate offset
        const utcDate = new Date().toLocaleString('en-US', { timeZone: 'UTC' });
        const tzDate = new Date().toLocaleString('en-US', { timeZone: timezone });

        const utcTime = new Date(utcDate).getTime();
        const tzTime = new Date(tzDate).getTime();

        const offsetMs = tzTime - utcTime;
        const offsetHours = offsetMs / (1000 * 60 * 60);

        const sign = offsetHours >= 0 ? '+' : '';
        const formattedOffset = `UTC ${sign}${offsetHours.toFixed(1)}`;

        return `${tzName} (${formattedOffset})`;
    }

    saveToLocalStorage() {
        const timezones = this.clocks.map(c => c.timezone);
        localStorage.setItem('selectedTimezones', JSON.stringify(timezones));
    }

    loadFromLocalStorage() {
        const saved = localStorage.getItem('selectedTimezones');
        if (saved) {
            try {
                const timezones = JSON.parse(saved);
                timezones.forEach(tz => this.addClockForTimezone(tz));
            } catch (error) {
                console.error('Error loading timezones:', error);
            }
        }
    }

    showMessage(message, type) {
        const grid = document.getElementById('timezonesGrid');
        const messageEl = document.createElement('div');
        messageEl.className = type;
        messageEl.textContent = message;
        messageEl.style.gridColumn = '1 / -1';

        grid.insertBefore(messageEl, grid.firstChild);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            messageEl.style.transition = 'opacity 0.3s ease';
            setTimeout(() => messageEl.remove(), 300);
        }, 3000);
    }
}

// Initialize on page load
let timezoneClock;
document.addEventListener('DOMContentLoaded', () => {
    timezoneClock = new TimezoneClock();
});

// Add local time as default
document.addEventListener('DOMContentLoaded', () => {
    // Optional: Add user's local timezone by default
    // Uncomment to enable:
    // const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // timezoneClock.addClockForTimezone(localTz);
});
