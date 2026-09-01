# 🕐 Multi-Timezone Digital Clock

A modern, responsive web application that displays real-time digital clocks across multiple time zones with both digital and analog displays.

## Features

✨ **Core Features:**
- 🌍 Display time in multiple time zones simultaneously
- 🕰️ Dual clock display (Digital + Analog)
- 📅 Date display in local timezone format
- ⏰ Real-time updates every second
- 💾 Local storage persistence (remembers selected timezones)
- 🎨 Modern, responsive UI with smooth animations
- 📱 Mobile-friendly design

✨ **Additional Features:**
- Quick preset buttons for popular timezones
- Custom timezone support via input field
- Timezone offset calculation
- Remove clocks individually
- Error handling for invalid timezones
- Success/error notifications

## Supported Timezones

The application supports all IANA timezone database entries. Some popular examples:

### North America
- `America/New_York` (Eastern Time)
- `America/Chicago` (Central Time)
- `America/Denver` (Mountain Time)
- `America/Los_Angeles` (Pacific Time)
- `America/Anchorage` (Alaska Time)
- `Pacific/Honolulu` (Hawaii Time)

### Europe
- `Europe/London` (GMT/BST)
- `Europe/Paris` (CET/CEST)
- `Europe/Berlin` (CET/CEST)
- `Europe/Moscow` (MSK)
- `Europe/Istanbul` (EET/EEST)

### Asia
- `Asia/Tokyo` (JST)
- `Asia/Shanghai` (CST)
- `Asia/Hong_Kong` (HKT)
- `Asia/Singapore` (SGT)
- `Asia/Bangkok` (ICT)
- `Asia/Dubai` (GST)
- `Asia/Kolkata` (IST)

### Oceania
- `Australia/Sydney` (AEDT/AEST)
- `Australia/Melbourne` (AEDT/AEST)
- `Australia/Brisbane` (AEST)
- `Pacific/Auckland` (NZDT/NZST)

### South America
- `America/Sao_Paulo` (BRT/BRST)
- `America/Argentina/Buenos_Aires` (ART)
- `America/Mexico_City` (CST/CDT)

## How to Use

### 1. **Add Timezone via Input**
   - Type a timezone name (e.g., `America/New_York`)
   - Press Enter or click "Add Timezone"
   - Clock appears in the grid

### 2. **Use Preset Buttons**
   - Click any preset button for quick addition
   - Includes 8 popular timezone presets

### 3. **Remove Timezone**
   - Click the "Remove" button on any clock card
   - Clocks are automatically saved to local storage

### 4. **View Information**
   - **Digital Time:** 24-hour format (HH:MM:SS)
   - **Analog Clock:** Visual representation with hour, minute, and second hands
   - **Date:** Full date with weekday and year
   - **Timezone Offset:** UTC offset display

## Technical Details

### Architecture

```
index.html (Structure)
  ├── Header & Title
  ├── Control Panel (Input + Add Button)
  ├── Clocks Grid (Dynamic Cards)
  └── Preset Buttons

styles.css (Styling)
  ├── Layout (Grid, Flexbox)
  ├── Components (Cards, Buttons, Input)
  ├── Animations (Fade, Slide, Scale)
  └── Responsive Design (Media Queries)

script.js (Logic)
  ├── TimezoneClock Class
  ├── Clock Rendering
  ├── Time Updates
  ├── Local Storage Management
  └── Event Handling
```

### Key Classes & Methods

**TimezoneClock Class:**
- `init()` - Initialize application
- `addClock()` - Add clock from input
- `addClockForTimezone(timezone)` - Add specific timezone
- `renderClock(clockData)` - Render clock card
- `updateClock(clockId)` - Update time display
- `updateAnalogClock(clockId, hour, minute, second)` - Update hand positions
- `removeClock(clockId)` - Remove clock
- `saveToLocalStorage()` - Persist clocks
- `loadFromLocalStorage()` - Load saved clocks

### Time Calculation

Uses browser's `Intl.DateTimeFormat` API for accurate timezone conversions:
- No external dependencies
- Automatic daylight saving time handling
- Works offline (after initial load)

### Analog Clock Hand Rotation

```javascript
secondDegrees = (second / 60) * 360
minuteDegrees = (minute / 60) * 360 + (second / 60) * 6
hourDegrees = (hour % 12 / 12) * 360 + (minute / 60) * 30 + (second / 3600) * 0.5
```

## Files

- **index.html** - Main structure and HTML markup
- **styles.css** - Complete styling and animations
- **script.js** - Application logic and functionality
- **README-CLOCK.md** - This documentation file

## Browser Support

✅ Works in all modern browsers:
- Chrome 24+
- Firefox 29+
- Safari 11+
- Edge 12+
- Opera 15+

Requires ES6 JavaScript support and `Intl.DateTimeFormat` API.

## Local Storage

The app automatically saves your selected timezones to browser local storage. 
Clocks are restored when you revisit the page.

**Stored key:** `selectedTimezones` (JSON array of timezone strings)

## Customization

### Change Grid Layout
Edit in `styles.css`:
```css
.timezones-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
```

### Change Update Frequency
Edit in `script.js`:
```javascript
setInterval(() => {
    this.clocks.forEach(clock => this.updateClock(clock.id));
}, 1000); // Change 1000ms to desired interval
```

### Add Custom Preset Buttons
Edit in `index.html`:
```html
<button class="preset-btn" data-tz="Your/Timezone">Display Name</button>
```

### Change Color Scheme
Edit CSS gradient colors:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

## Performance

- **Updates:** 1 second interval per clock
- **Memory:** ~1KB per clock stored in local storage
- **CPU:** Minimal (only DOM updates on change)
- **Scalability:** Handles 50+ simultaneous clocks efficiently

## Future Enhancements

- ⏱️ Stopwatch/Timer for each timezone
- 🔔 Alarms with timezone support
- 🌡️ Weather integration for each city
- 📊 Timezone comparison charts
- 🎯 Meeting scheduler across timezones
- 🎙️ Audio chime on the hour
- 🌙 Dark/Light theme toggle
- 🌐 Multi-language support

## Troubleshooting

### Invalid Timezone Error
- Check spelling (e.g., `America/New_York`, not `America/newyork`)
- Use IANA timezone database format
- See supported timezones list above

### Clock Not Updating
- Refresh the page
- Clear browser cache
- Check browser console for errors
- Ensure JavaScript is enabled

### Local Storage Not Working
- Check browser privacy settings
- Try incognito/private mode
- Clear browser storage and reload

## License

MIT License - Feel free to use and modify

## Author

Created as part of the Hospital Management System project

---

**Version:** 1.0.0  
**Last Updated:** 2024
