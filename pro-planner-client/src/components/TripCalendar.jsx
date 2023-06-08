import './TripCalendar.css'
import Cell from './Cell.js'
import { useState, useEffect } from 'react'
import { format, compareAsc, getDay, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns/fp'



// const formMonthMap = (inputDate) => {
//     const firstDay = new Date(inputDate);
//     firstDay.setDate(1);

//     const firstOfCalendar = firstDay.getDay() ? previousSunday(firstDay) : firstDay;
//     const lastDayOfCalendar = add(firstOfCalendar, { days: 6, weeks: 6 });

//     const monthArr = [];
//     let startDate = firstOfCalendar;
//     let endDate = addDays(startDate, 6);
//     while (!isSameDay(endDate, lastDayOfCalendar)) {
//         startDate = addDays(startDate, 7);
//         endDate = addDays(endDate, 7);
//     }
//     return monthArr;
// }
const MONTHS = {
    0: 'January',
    1: 'February',
    2: 'March',
    3: 'April',
    4: 'May',
    5: 'June',
    6: 'July',
    7: 'August',
    8: 'September',
    9: 'October',
    10: 'November',
    11: 'December',
}

const TripCalendar = () => {
    // temp variables
    const monthArray = [[1,2,3,4, 5, 6, 7],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11]];
    const startDate = new Date(2021, 5, 15)
    const endDate = new Date(2024, 6, 20)

   
   
    const [startDayOfMonth, setStartDayOfMonth] = useState(startOfMonth(startDate));

    const [currYear, setCurrYear] = useState(startDate.getFullYear());
    const [currMonth, setCurrMonth] = useState(Number.parseInt(startDate.getMonth()));


    // Handle pressing next month -> changes the state of currMonth, and if December is our currState, then changes the state of currYear
    const handleChangetMonth = (isNext) => {
        if (isNext && startDayOfMonth) {
            setStartDayOfMonth(addMonths(startDayOfMonth, 1));
            console.log(startDayOfMonth)
        } else {
            setStartDayOfMonth(subMonths(startDayOfMonth, 1));
            console.log(startDayOfMonth)
        }
    }

        useEffect(() => {
        console.log(startDayOfMonth);
    }, [startDayOfMonth]);


    return <div>
        Trip Calendar!
        <div className="calendar-grid">
            <header class="calendar-toolbar">
                <button onClick={() => handleChangetMonth(false)} style={ {background: 'inherit', border: 'none'} }>{'<'}</button>
                <p> {currYear + " " + MONTHS[currMonth]}</p>
                <button onClick={() => handleChangetMonth(true)} style={ {background: 'inherit', border: 'none'}}>{'>'}</button>
            </header>
            <main>
                <ul className='weekday-labels'>
                    <li>Sun</li>
                    <li>Mon</li>
                    <li>Tue</li>
                    <li>Wed</li>
                    <li>Thu</li>
                    <li>Fri</li>
                    <li>Sat</li>
                </ul>
                {monthArray.map((weekArr) => {
                    return <div className="week-container">
                        {weekArr.map((day) => {
                            return <div className="day-container">
                                <Cell className="half-day" type="AM" date={ startDate } />
                                <Cell className="half-day" type="PM"  date={ startDate }/>
                            </div>
                        })}
                    </div>
                })}
            </main>
        </div>
    </div>
}

export default TripCalendar;
