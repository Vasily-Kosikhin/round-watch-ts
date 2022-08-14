import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ITime, IClock } from '../../types/types';
import cl from './Clock.module.css'

const Clock: React.FC = () => {



  const [clock, setClock] = useState<IClock>({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    fetchingTime();
  }, [])

  async function fetchingTime() {
    try {
      const response = await axios.get<ITime>(`http://worldtimeapi.org/api/timezone/Europe/Moscow`)

      setClock((clock) => {
        const currentHour = new Date(response.data.utc_datetime).getHours()
        return {
          ...clock, hours: currentHour < 12 ? currentHour : currentHour - 12,
          minutes: new Date(response.data.utc_datetime).getMinutes(),
          seconds: new Date(response.data.utc_datetime).getSeconds()
        }
      })

      const changeClock = (clock: IClock) => {
        if (clock.seconds === 60) {
          clock.minutes += 1;
          clock.seconds = 0;
        }
        if (clock.minutes === 60) {
          clock.hours += 1;
          clock.minutes = 0;
        }
        if (clock.hours === 12) {
          clock.hours = 0
        }
        clock.seconds += 1;

        return { ...clock }
      }
      setInterval(() => setClock((clock) => changeClock(clock)), 1000)
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <div className={cl.clock}>
      <div className={cl.clock__secondArrow} style={{ rotate: `${360 * (clock.seconds / 60)}deg` }}>
        <div className={cl.clock__secondArrow_body} ></div>
      </div>
      <div className={cl.clock__minuteArrow} style={{ rotate: `${360 * (clock.minutes / 60)}deg` }}>
        <div className={cl.clock__minuteArrow_body} ></div>
      </div>
      <div className={cl.clock__hourArrow} style={{ rotate: `${360 * (clock.hours / 12)}deg` }}>
        <div className={cl.clock__hourArrow_body} ></div>
      </div>
    </div >
  )
}
export default Clock;
