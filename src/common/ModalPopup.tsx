import {
    Alert,
    Backdrop,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Modal,
    Typography
} from '@mui/material';
import {useModal} from './ModalContext';
import React from "react";

const ModalPopup = () => {
    const { modalDataState, closeModal } = useModal();

    return (
        <>
            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={modalDataState.open && (modalDataState.type === 'alert' || modalDataState.type === 'info' || modalDataState.type === 'progress' || modalDataState.type === 'success')}
                onClose={modalDataState.callBack}
                closeAfterTransition
                slots={{backdrop: Backdrop}}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                    },
                }}
            >
                <Typography>
                    <Alert sx={{
                        position: 'absolute' as 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        p: 4,
                        display: modalDataState.type === 'progress'?'none':''
                    }} severity={modalDataState.type === 'info'?'info':modalDataState.type === 'success'?'success':'error'}>{modalDataState.content}</Alert>
                    <CircularProgress size={100} sx={{display: modalDataState.type === 'progress'?'':'none' ,
                                            position: 'absolute' as 'absolute',
                                            top: 'calc(50% - 50px)',
                                            left: 'calc(50% - 50px)',
                                            transform: 'translate(-50%, -50%)'}} />
                </Typography>
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