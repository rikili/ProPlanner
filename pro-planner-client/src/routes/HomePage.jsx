import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { setupParams } from '../redux/planParamSlice';
import { ERR_TYPE, LOAD_STATUS } from '../constants';
import { setError } from "../redux/errorSlice";
import NavigationBar from "../components/NavigationBar";
import ErrorContainer from '../components/ErrorContainer';
import LoadingDisplay from '../components/LoadingDisplay';
import { Outlet, useNavigate } from "react-router";

import './HomePage.scss';

const HomePage = () => {
	const tripId = useLoaderData();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedUser = useSelector(state => state.user.selectedUser);
	const isParamsInit = useSelector(state => state.planParameters.isInitialized);
	const loadingState = useSelector(state => state.planParameters.paramStatus);

	const isUserSelected = !!selectedUser;

	useEffect(() => {
		if (!isUserSelected) {
			navigate(`/user/${tripId}`);
		} else {
			dispatch(setupParams(tripId));
		}
	}, [dispatch, tripId, isUserSelected, navigate]);

	if (loadingState === LOAD_STATUS.FAILED) {
		dispatch(setError({
			errType: ERR_TYPE.ERR,
			message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
			redirect: '/',
			disableControl: true
		}));
	}

	return <>
		<ErrorContainer />
		<div className='home-page'>
			<NavigationBar />
			<div className='page-content'>
				{ (loadingState === LOAD_STATUS.LOADING) && <LoadingDisplay /> }
				{ isParamsInit && <Outlet /> }
			</div>
		</div>
	</>;
};

export default HomePage;
