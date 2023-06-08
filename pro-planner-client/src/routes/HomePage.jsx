import NavigationBar from "../components/NavigationBar";
import { Outlet } from "react-router";

const HomePage = () => {
	return <div>
		<NavigationBar />
        <Outlet />
	</div>;
};

export default HomePage;
