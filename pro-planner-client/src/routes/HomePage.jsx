import NavigationBar from "../components/NavigationBar";
import { Outlet } from "react-router";
import Map from "../components/Map"

const HomePage = () => {
	return <>
		<NavigationBar />
        <Outlet />
        <Map />
	</>;
};

export default HomePage;
