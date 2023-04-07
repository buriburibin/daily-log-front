import {Alert, Backdrop, Box, Modal} from '@mui/material';
import {useAlert} from './Context';
import React from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4,
};


const AlertPopup = () => {
    const { text, open ,setAlert} = useAlert();
    const handleClose = () => setAlert('',false,()=>{});

    return (
    <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
            backdrop: {
                timeout: 500,
            },
        }}
    >
        <Alert sx={style} severity='error'>{text}</Alert>
    </Modal>
    );
};

export default AlertPopup;