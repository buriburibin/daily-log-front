import {Alert, Backdrop, Button, Dialog, DialogActions, DialogTitle, Modal} from '@mui/material';
import {useModal} from './ModalContext';
import React from "react";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    p: 4,
};

const ModalPopup = () => {
    const { modalDataState, closeModal } = useModal();

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalDataState.open && modalDataState.type === 'alert'}
                onClose={modalDataState.callBack}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Alert sx={style} severity='error'>{modalDataState.content}</Alert>
            </Modal>
            <Dialog
                open={modalDataState.open && modalDataState.type === 'dialog'}
                onClose={closeModal}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {modalDataState.content}
                </DialogTitle>
                <DialogActions>
                    <Button onClick={closeModal}>취소</Button>
                    <Button onClick={modalDataState.callBack} autoFocus>
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ModalPopup;