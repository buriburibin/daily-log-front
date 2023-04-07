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


// const initialState = {
//     text: '',
//     type: 'alert',
//     open: false,
//     callBack: ()=>{},
// };

// type callBackType = ()=>void;
//
// const AlertContext = createContext({
//     ...initialState,
//     setAlert: (text:string, type:string, open:boolean, callBack:()=>void) => {},
// });

// interface AlertProviderProps {
//     children ?: ReactElement;
// }

// export const AlertProvider = ({ children }:AlertProviderProps) => {
//     const [text, setText] = useState<string>('');
//     const [type, setType] = useState<string>('alert');
//     const [open, setOpen] = useState<boolean>(false);
//     const [callBack, setCallBack] = useState<callBackType>(()=>{console.log('closeAlert')});
//
//     const setAlert = (text:string, type:string, open:boolean, callBack:callBackType) => {
//         setText(text);
//         setType(type);
//         setOpen(open);
//         setCallBack(callBack);
//     };
//
//     return (
//         <AlertContext.Provider
//             value={{
//                 text,
//                 type,
//                 open,
//                 callBack,
//                 setAlert,
//             }}
//         >
//             {children}
//         </AlertContext.Provider>
//     );
// };
//
// export default AlertContext;