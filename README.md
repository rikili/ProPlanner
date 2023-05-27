


# Project Progress 1

## Project Description
This is an outing arrangement application that focuses on seamlessly scheduling and planning trips for groups. The application will store and process information on individual availability and preferences, and streamline decision-making. In addition to scheduling and finalizing a time period for a trip plan, we hope to utilize additional features such voting system, cost splitting, and more advanced google map integrations. Our goal is to provide a user-friendly platform for efficient group trip planning.

## Project Requirements

### Minimal Requirements
- Shareable link that can identify outing
  - Frontend requests new outing be made
  - Backend server generates outing identification
  - Database collections/documents are updated with base information to support new outing
  - Frontend can make requests through backend to modify + fetch outing information given identifier
- Users can add availability information - stored individually  
  - Users are provided an intuitive interface to map out busy/available time slots
  - Frontend sends availability profile to backend
  - Backend processes user provided data with database availability information to form available time slots
  - Backend stores available time slots in database
  - Frontend can fetch available time slots
- System displays the time slots that work for everyone to schedule their trip

### Standard Requirements
- Users can identify themself and have inputted information tracked to that identity (via username)
- Update outing profile with determined trip decisions (ex. Location, date period)
- Overview page summarizes the availabilities or selected decisions
- Outing profile schedule can be restricted to certain start and end times (users can only input availability for certain period)
- Google maps integration to display location on google maps (open in new tab)

### Stretch Requirements
- Cost splitting functionality to aggregate overall cost and delegate costs per person
- Voting system to support polls and display results of such polls
- Google Maps static map/places API integration
  - Recommendation options (eg. nearby restaurants, bars, etc.)
  - Static display to get an understanding of surrounding location


