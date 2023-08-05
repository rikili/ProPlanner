import React from 'react';
import {Card, Container} from 'react-bootstrap';
import './OverviewPage.scss';
import ExpenseSplit from '../components/ExpenseSplit';
import {useSelector} from 'react-redux';
import Map from '../components/Map';
import {format, isSameDay, parseISO} from "date-fns";
import {PLAN_TYPE} from '../constants';

const OverviewPage = () => {
    const tripName = useSelector((state) => state.planParameters.name);
    const location = useSelector((state) => state.planParameters.location);
    const decidedDates = useSelector(state => state.planParameters.decisionRange);
    const description = useSelector(state => state.planParameters.description);
    const dateRange = useSelector(state => state.planParameters.dateTimeRange);
    const planType = useSelector(state => state.planParameters.planType);

    const isOuting = (planType === PLAN_TYPE.OUTING);
    const startDate = isOuting ? new Date(dateRange[0][0]) : new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

    const buildTimeString = (start, end) => `${format(new Date(start), 'hh:mm a')} - ${format(new Date(end), 'hh:mm a')}`;
    const buildDateString = () => {
        if (isSameDay(startDate, endDate)) return format(startDate, 'MMMM d yyyy');
        return `${format(startDate, 'MMMM d yyyy')} - ${format(endDate, 'MMMM d yyyy')}`;
    }

    function processDecidedDates(decidedDates) {
        if (!decidedDates || decidedDates.length !== 2) {
            return <i>A decision has not been made yet</i>
        }
        const [startDate, endDate] = decidedDates;
        const processedStartDate = format(parseISO(startDate), 'EEE, MMM d yyyy');
        const processedEndDate = format(parseISO(endDate), 'EEE, MMM d yyyy');
        return `${processedStartDate} - ${processedEndDate}`
    }

    return (
        <>
            <Container className="overview-container">
                <div className="overview-header">
                    <div className="overview-header-title"><b>{tripName}</b></div>
                    <div className="overview-header-dates">{buildDateString()}</div>
                    {isOuting && <div className="overview-header-times">{buildTimeString(startDate, endDate)}</div>}
                </div>
                <div className="overview-content">
                    <div className="overview-map-row">
                        <div className="overview-map-card">
                            <Map/>
                        </div>
                    </div>
                    <div className="overview-details-cost-row">
                        <div className="overview-details-col">
                            <Card className="overview-details-card">
                                <Card.Header as="h4">Details</Card.Header>
                                <Card.Body>
                                    <Card.Subtitle
                                        className="mt-1">{isOuting ? 'Decided Times: ' : 'Decided Dates: '}</Card.Subtitle>
                                    <Card.Text>
                                        {processDecidedDates(decidedDates)} <br/>
                                        {isOuting && buildTimeString(startDate, endDate)}
                                    </Card.Text>
                                    <Card.Subtitle>Location:</Card.Subtitle>
                                    <Card.Text>{location}</Card.Text>
                                    {description ? <Card.Subtitle>Description:</Card.Subtitle> : null}
                                    {description ? <Card.Text>{description}</Card.Text> : null}
                                </Card.Body>
                            </Card>
                            <ExpenseSplit className="cost-card"/>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default OverviewPage;


