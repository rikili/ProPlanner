import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { setupParams, updatePlan } from '../redux/planParamSlice';
import { ERR_TYPE, PLAN_TYPE } from '../constants';
import { resetError, setError } from "../redux/errorSlice";
import NavigationBar from "../components/NavigationBar";
import ErrorContainer from '../components/ErrorContainer';
import { Outlet, useNavigate } from "react-router";

import axios from 'axios';
import { buildServerRoute } from '../helpers/Utils';
import './HomePage.scss';

const isDateTimeValid = (planType, dateTimeRange) => {
    if (planType === PLAN_TYPE.OUTING) {
        return (
            Array.isArray(dateTimeRange) && 
            dateTimeRange[0] &&
            dateTimeRange[1] &&
            Array.isArray(dateTimeRange[0]) &&
            dateTimeRange[0].length === 2
        );
    } else {
        return (
            Array.isArray(dateTimeRange) && 
            dateTimeRange[0] &&
            dateTimeRange[1] &&
            dateTimeRange.length === 2
        );
    }
}

const isParamsValid = (params) => {
    return (
        params.name !== null &&
        params.dateTimeRange.length > 0 &&
        params.dayOffset.length > 0 &&
        isDateTimeValid(params.planType, params.dateTimeRange)
    )
}

const HomePage = () => {
	const tripId = useLoaderData();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedUser = useSelector(state => state.user.selectedUser);
	const isParamsInit = useSelector(state => state.planParameters.isInitialized);
	const planParams = useSelector(state => state.planParameters);

	const isUserSelected = !!selectedUser;

	useEffect(() => {
		if (!isUserSelected) {
			navigate(`/user/${tripId}`);
		} else {
			axios.get(buildServerRoute('trip',tripId)) //TODO: use suspense
				.then(({ data }) => {
					console.log(data);
					dispatch(updatePlan(data));
				})
				.catch(() => {
					dispatch(setError({
						errType: ERR_TYPE.ERR,
						message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
						redirect: '/',
						disableControl: true
					}));
				});
		}
	}, [dispatch, tripId, isUserSelected, navigate]);

	// if (isParamsInit) {
	// 	const isValid = isParamsValid(planParams);
	// 	if (!isValid) {
	// 		dispatch(setError({
	// 			errType: ERR_TYPE.ERR,
	// 			message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
	// 			redirect: '/',
	// 			disableControl: true
	// 		}));
	// 	} else {
	// 		dispatch(resetError());
	// 	}
	// }

	return <>
		<ErrorContainer />
		<div className='home-page'>
			<NavigationBar />
			<div className='page-content'>
				{ isParamsInit && <Outlet />}
			</div>
		</div>
	</>;
};

export default HomePage;
