import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { setupParams, updatePlan } from '../redux/planParamSlice';
import { ERR_TYPE, LOAD_STATUS } from '../constants';
import { setError } from "../redux/errorSlice";
import NavigationBar from "../components/NavigationBar";
import LoadingDisplay from '../components/LoadingDisplay';
import { Outlet, useNavigate } from "react-router";
import axios from 'axios';

import './HomePage.scss';
import { buildServerRoute } from '../helpers/Utils';

const HomePage = () => {
	const planId = useLoaderData();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedUser = useSelector(state => state.user.selectedUser);
	const isParamsInit = useSelector(state => state.planParameters.isInitialized);
	const loadingState = useSelector(state => state.planParameters.paramStatus);

	const isUserSelected = !!selectedUser;

	useEffect(() => {
		if (!isUserSelected) {
			navigate(`/user/${planId}`);
		} else {
			dispatch(setupParams(planId));
			axios.get(buildServerRoute('plan', planId))
				.then((result) => {
					dispatch(updatePlan(result.data));
				})
				.catch((err) => {
					if (err.response.status === 404) {
						dispatch(setError({
							errType: ERR_TYPE.ERR,
							message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
							redirect: '/',
							disableControl: true
						}));
					}
				});
		}
	}, [dispatch, planId, isUserSelected, navigate]);

	return <>
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
