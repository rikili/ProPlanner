import NavigationBar from "../components/NavigationBar";
import TripExpense from "../components/TripExpense";
import ExpenseSplit from "../components/ExpenseSplit";

const CostPage = () => {
    return <>
        <NavigationBar />
        <TripExpense />
        <div className="d-flex justify-content-center">
            <ExpenseSplit />
        </div>
    </>
}

export default CostPage;
