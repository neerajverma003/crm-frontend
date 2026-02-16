// TimeLogSection.jsx
import React, { useState, useEffect } from 'react';
import styles from './TimeLogSection.module.css';

const TimeLogSection = () => {
  const [time, setTime] = useState('');
  const [date, setDate] = useState('');
  const [logType, setLogType] = useState('monthly');
  const [weather, setWeather] = useState(null);

  // Update time & date every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString());
      setDate(
        now.toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'long',
          year: 'numeric',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch weather on mount & every 10 minutes
  useEffect(() => {
    const API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
    const CITY = 'YourCity'; // e.g. 'London'
    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          icon: data.weather[0].icon,
          desc: data.weather[0].description,
        });
      } catch (err) {
        console.error('Failed to fetch weather', err);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogTypeChange = (e) => {
    setLogType(e.target.value);
  };

  // Determine day or night icon
  const isNight = weather?.icon?.endsWith('n');
  const skyIcon = isNight ? '🌙' : '☀️';

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.left}>          
          <div className={styles.icon} role="img" aria-label={isNight ? 'Moon' : 'Sun'}>
            {skyIcon}
          </div>
          <div className={styles.dateTime}>
            <div className={styles.date}>{date}</div>
            <div className={styles.time}>{time}</div>
          </div>
        </div>
        {weather && (
          <div className={styles.weather}>
            <div className={styles.temp}>{weather.temp}°C</div>
            <div className={styles.desc}>{weather.desc}</div>
          </div>
        )}
      </div>

      <div className={styles.controls}>
        <select
          className={styles.select}
          value={logType}
          onChange={handleLogTypeChange}
        >
          <option value="monthly">This Month Log</option>
          <option value="yearly">This Year Log</option>
        </select>
        <div className={styles.badges}>
          <div className={`${styles.badge} ${styles.primary}`}>Gross: {logType === 'monthly' ? '34 Hrs 4 Min' : '84 Hrs 24 Min'}</div>
          <div className={`${styles.badge} ${styles.warning}`}>Break: {logType === 'monthly' ? '0 Hrs 0 Min' : '14 Hrs 49 Min'}</div>
          <div className={`${styles.badge} ${styles.success}`}>Net: {logType === 'monthly' ? '34 Hrs 4 Min' : '69 Hrs 35 Min'}</div>
        </div>
      </div>

      <div className={styles.footer}>
        <button className={styles.holidayBtn} disabled>
          You are on holiday
        </button>
      </div>
    </div>
  );
};

export default TimeLogSection;