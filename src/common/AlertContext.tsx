import {createContext, ReactElement, useState} from 'react';
import {AlertColor} from "@mui/material";

const initialState = {
    text: '',
    // type: 'error',
    open: false,
    callBack: ()=>{},
};

type callBackType = ()=>void;

const AlertContext = createContext({
    ...initialState,
    setAlert: (text:string, open:boolean, callBack:()=>void) => {},
});

interface AlertProviderProps {
    children ?: ReactElement;
}

export const AlertProvider = ({ children }:AlertProviderProps) => {
    const [text, setText] = useState('');
    // const [type, setType] = useState<AlertColor|undefined>('error');
    const [open, setOpen] = useState(false);
    const [callBack, setCallBack] = useState<callBackType>(()=>{console.log('closeAlert')});

    const setAlert = (text:string, open:boolean, callBack:callBackType) => {
        setText(text);
        // setType(type);
        setOpen(open);
        setCallBack(callBack);
    };

    return (
        <AlertContext.Provider
            value={{
                text,
                // type,
                open,
                callBack,
                setAlert,
            }}
        >
            {children}
        </AlertContext.Provider>
    );
};

export default AlertContext;