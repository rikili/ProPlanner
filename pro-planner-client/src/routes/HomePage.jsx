import NavigationBar from "../components/NavigationBar";
import { Outlet } from "react-router";

const HomePage = () => {
	return <>
		<NavigationBar />
        <Outlet />
	</>;
};

export default HomePage;
