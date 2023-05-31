import './TripCalendar.css'

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

const TripCalendar = () => {
    const monthArray = [[1,2,3,4, 5, 6, 7],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11],[5,6,7,8,9,10,11]];

    return <div>
        Trip Calendar!
        <div className="calendar-grid">
            <header class="calendar-toolbar">
                <button onClick={() => console.log("left")}>{'<'}</button>
                <p>January 2023</p>
                <button onClick={() => console.log("right")}>{'>'}</button>
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
                                <div className="half-day">a</div>
                                <div className="half-day">b</div>
                            </div>
                        })}
                    </div>
                })}
            </main>
        </div>
    </div>
}

export default TripCalendar;
