import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { updatePlan } from '../redux/planParamSlice';
import { LOAD_STATUS, PLAN_TYPE } from '../constants';
import { setInvalidPlanError } from '../redux/errorSlice';
import NavigationBar from '../components/NavigationBar';
import LoadingDisplay from '../components/LoadingDisplay';
import { Outlet, useNavigate } from 'react-router';
import axios from 'axios';
import { getCostAsync } from "../redux/costSlice";
import { useLocation } from "react-router";
import { getCostAsync } from "../redux/costSlice";
import { useLocation } from "react-router";
import { clearTripSelections } from '../redux/tripSlice';
import { clearOutingSelections } from '../redux/outingSlice';
import './HomePage.scss';
import { buildServerRoute } from '../helpers/Utils';



const HomePage = () => {
	const [paramStatus, setParamStatus] = useState(null);
	const planId = useLoaderData();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedUser = useSelector(state => state.user.selectedUser);
	const isParamsInit = useSelector(state => state.planParameters.isInitialized);
	const planType = useSelector(state => state.planParameters.planType);

	const isUserSelected = !!selectedUser;

	const tripId = useLocation().pathname.split('/')[1];


	useEffect(() => {
		dispatch(getCostAsync({tripId: planId}))
		
		if (!isUserSelected) {
			navigate(`/user/${planId}`);
		} else {
			axios
				.get(buildServerRoute('plan', planId))
				.then(result => {
					setParamStatus(LOAD_STATUS.SUCCESS);
					dispatch(updatePlan(result.data));
				})
				.catch(err => {
					setParamStatus(LOAD_STATUS.FAILED);
					if (err.response.status === 404) {
						dispatch(setInvalidPlanError());
					}
				});
			setParamStatus(LOAD_STATUS.LOADING);
			planType === PLAN_TYPE.TRIP
				? dispatch(clearTripSelections())
				: dispatch(clearOutingSelections());
			//call dispatch and reset user selections
		}
	}, [dispatch, planId, planId, isUserSelected, navigate]);
	
	
	return (
		<>
			<div className="home-page">
				<NavigationBar planId={planId} />
				<div className="page-content">
					{paramStatus === LOAD_STATUS.LOADING && <LoadingDisplay />}
					{isParamsInit && <Outlet />}
				</div>
			</div>
		</>
	);
};

export default HomePage;
