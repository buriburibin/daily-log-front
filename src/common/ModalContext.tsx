import { ReactElement, useCallback } from 'react';
import {atom, useRecoilState} from "recoil";

type ModalType = {
    content: ReactElement | string,
    open: boolean;
    type: string,
    callBack?: ()=>any
}

export const modalState = atom<ModalType>({
    key: "modalState",
    default: {
        content: "",
        open: false,
        type: 'alert',
    }
});

type OpenModalType = {
    content: ReactElement | string,
    type: string,
    callBack?: ()=>any
};

export const useModal = () => {
    const [modalDataState, setModalDataState] = useRecoilState(modalState);

    const closeModal = useCallback(
        () =>
            setModalDataState((prev) => {
                return { ...prev, open: false };
            }),
        [setModalDataState]
    );

    const openModal = useCallback(
        ({ content, type, callBack }: OpenModalType) =>
            setModalDataState({
                open: true,
                content: content,
                type: type,
                callBack: callBack
            }),
        [setModalDataState]
    );

    return { modalDataState, closeModal, openModal };
};