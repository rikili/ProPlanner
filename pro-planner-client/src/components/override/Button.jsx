import { Button as BaseButton } from 'react-bootstrap';

const Button = (props) => {
    return <>
        <style type="text/css">
            {`
                .btn-custom-primary {
                    color: white !important;
                    background-color: rgb(23, 69, 126) !important;
                }
                .btn-custom-primary:hover {
                    color: white !important;
                    background-color: rgb(43, 92, 148) !important;
                }
                .btn-custom-primary:active {
                    color: white !important;
                    background-color: rgb(22, 55, 94) !important;
                }
                .btn-custom-primary:hover:active {
                    color: white !important;
                    background-color: rgb(22, 55, 94) !important;
                }
                .btn-custom-primary:disabled {
                    color: rgb(180, 180, 180);
                    background-color: rgb(43, 92, 148);
                    border-color: rgb(43, 92, 148);
                }

                .btn-custom-primary .active {
                    background-color: blue;
                }

                .btn-custom-secondary {
                    color: black;
                    background-color: rgb(207, 207, 207);
                }
                .btn-custom-secondary:hover {
                    color: black;
                    background-color: rgb(182, 182, 182);
                }
                .btn-custom-secondary:active {
                    color: darkgrey !important;
                    background-color: rgb(87, 87, 87) !important;
                }
                .btn-custom-secondary:hover:active {
                    color: darkgrey;
                    background-color: rgb(87, 87, 87);
                }
                .btn-custom-secondary:disabled {
                    color: grey;
                    background-color: rgb(207, 207, 207);
                }

                .btn-custom-danger {
                    color: rgb(129, 29, 29);
                    background-color: rgb(218, 80, 80);
                }
                .btn-custom-danger:hover {
                    color: rgb(119, 23, 23);
                    background-color: rgb(179, 49, 49);
                }
                .btn-custom-danger:active {
                    color: rgb(201, 51, 51) !important;
                    background-color: rgb(153, 24, 24) !important;
                }
                .btn-custom-danger:hover:active {
                    color: rgb(201, 51, 51);
                    background-color: rgb(153, 24, 24);
                }
                .btn-custom-danger:disabled {
                    color: rgb(226, 119, 119);
                    border-color: rgb(235, 190, 190);
                    background-color: rgb(235, 190, 190);
                }

                .btn-custom-success {
                    color: white;
                    background-color: rgb(76, 155, 96);
                }
                .btn-custom-success:hover {
                    color: white;
                    background-color: rgb(79, 173, 103);
                }
                .btn-custom-success:active {
                    color: rgb(178, 231, 191) !important;
                    background-color: rgb(53, 148, 76) !important;
                }
                .btn-custom-success:hover:active {
                    color: rgb(178, 231, 191);
                    background-color: rgb(53, 148, 76);
                }
                .btn-custom-success:disabled {
                    color: rgb(60, 167, 86);
                    border-color: rgb(135, 202, 152);
                    background-color: rgb(135, 202, 152);
                }

                .btn-custom-outline-primary {
                    color: rgb(23, 69, 126);
                    border-color: rgb(23, 69, 126);
                }
                .btn-custom-outline-primary:hover {
                    color: white;
                    background-color: rgb(23, 69, 126);
                }
                .btn-custom-outline-primary:active {
                    color: white !important;
                    background-color: rgb(22, 55, 94) !important;
                }
                .btn-custom-outline-primary:hover:active {
                    color: white;
                    background-color: rgb(22, 55, 94);
                }
            `}
        </style>

        <BaseButton {...props} />
    </>
};

export default Button;
