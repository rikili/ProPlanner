import { Spinner } from "react-bootstrap";

const LoadingDisplay = () => {
    return (
        <div
            style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
                width: "100%",
                height: "100%",
            }}
        >
            <Spinner />
            <p>Loading...</p>
        </div>
    );
};

export default LoadingDisplay;

