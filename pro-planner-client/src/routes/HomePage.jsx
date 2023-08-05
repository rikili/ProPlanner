import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLoaderData } from 'react-router-dom';
import { updatePlan } from '../redux/planParamSlice';
import { ERR_TYPE, LOAD_STATUS } from '../constants';
import { setError } from "../redux/errorSlice";
import NavigationBar from "../components/NavigationBar";
import LoadingDisplay from '../components/LoadingDisplay';
import { Outlet, useNavigate } from "react-router";
import axios from 'axios';

import './HomePage.scss';
import { buildServerRoute } from '../helpers/Utils';

const HomePage = () => {
	const [paramStatus, setParamStatus] = useState(null);
	const planId = useLoaderData();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const selectedUser = useSelector(state => state.user.selectedUser);
	const isParamsInit = useSelector(state => state.planParameters.isInitialized);

	const isUserSelected = !!selectedUser;

	useEffect(() => {
		if (!isUserSelected) {
			navigate(`/user/${planId}`);
		} else {
			axios.get(buildServerRoute('plan', planId))
				.then((result) => {
					setParamStatus(LOAD_STATUS.SUCCESS);
					dispatch(updatePlan(result.data));
				})
				.catch((err) => {
					setParamStatus(LOAD_STATUS.FAILED);
					if (err.response.status === 404) {
						dispatch(setError({
							errType: ERR_TYPE.ERR,
							message: 'Information of this plan is invalid, malformed, or missing. Close this notification to be redirected to the landing page.',
							redirect: '/',
							disableControl: true
						}));
					}
				});
			setParamStatus(LOAD_STATUS.LOADING);
		}
	}, [dispatch, planId, isUserSelected, navigate]);

	return <>
		<div className='home-page'>
			<NavigationBar planId={planId}/>
			<div className='page-content'>
				{ (paramStatus === LOAD_STATUS.LOADING) && <LoadingDisplay /> }
				{ isParamsInit && <Outlet /> }
			</div>
		</div>
	</>;
};

export default HomePage;
