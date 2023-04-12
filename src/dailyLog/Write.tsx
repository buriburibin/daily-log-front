import React, {useEffect, useState} from 'react';
import {Button, Container, TextField, Typography} from "@mui/material";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import TuiEditor from "../common/Editor";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {MobileDatePicker, MobileTimePicker} from "@mui/x-date-pickers";
import dayjs from "dayjs";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import 'dayjs/locale/ko';
import {request} from "../utils/util";
import {useNavigate} from "react-router-dom";
import {useModal} from "../common/ModalContext";

interface DailyLog {
    logTitle:string;
    logContent:string;
    logHtml:string;
    logDate:string;
    setStartTime:string;
    setEndTime:string;
}

const Write = () => {
    const navigate = useNavigate();
    const {openModal,closeModal} = useModal();
    const [htmlStr, setHtmlStr] = useState<string>('');
    // const [title, setTitle] = useState<string>('');
    // const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
    // const [startTime, setStartTime] = useState<Dayjs | null>(dayjs(new Date()));
    // const [endTime, setEndTime] = useState<Dayjs | null>(dayjs(new Date()));
    const [dailyLog, setDailyLog] = useState<DailyLog>({
        logTitle:'',logContent:'',logHtml:'',logDate:dayjs(new Date()).format('YYYY-MM-DD'),
        setStartTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm'),setEndTime: dayjs(new Date()).format('YYYY-MM-DD HH:mm')
    });

    const saveDailyLog = async () => {
        try {
            console.log(dailyLog)
            if(dailyLog.setStartTime>=dailyLog.setEndTime){
                openModal({content:'종료시간을 시작시간보다 앞으로 지정할 수 없습니다.', type:'alert', callBack:()=>{closeModal()}});
                return;
            }
            if(!dailyLog.logContent){
                openModal({content:'일일업무 내용을 입력해주세요.', type:'alert', callBack:()=>{closeModal()}});
                return;
            }
            const res: any = await request<string>(`/user/dailyLog`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dailyLog)
                });

            const json = await res.json();
            if (json.logSeq) {
                navigate('/', {replace: true})
            } else {
                console.log('일일업무 저장 오류')
                openModal({content:'일일업무 저장 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
            }
        } catch (error) {
            console.log('일일업무 저장 요청 실패')
            openModal({content:'일일업무 저장 요청 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
        }
    }

    const uploadCallback = (file: Blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            // reader.onloadend = async () => {
            //     const formData = new FormData();
            //     formData.append("multipartFiles", file);
            //     const res = await axios.post('http://localhost:8080/uploadImage', formData);
            //
            //     resolve({ data: { link: res.data } });
            // };

            reader.readAsDataURL(file);
        });
    };

    useEffect(()=>{
        const regex = /(<([^>]+)>)/ig;
        const content = htmlStr.replace(regex, '');
        setDailyLog({...dailyLog,logHtml:htmlStr,logContent:content})
    },[htmlStr])

    return (
        <Container sx={{width:'100%', height:{md:'calc(100vh - 350px)',xs:'calc(100vh - 480px)'}}}>
            <Typography align={'center'} variant={"h2"}>
                업무 작성
            </Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', width:'calc(100% - 20px)'}} value={dailyLog.logTitle} label={'업무명'} onChange={(event)=>setDailyLog({...dailyLog,logTitle:event.target.value})} ></TextField>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ko'}>
                <MobileDatePicker sx={{marginLeft:'10px', marginRight:'20px', marginBottom:'10px'}} label={'업무 날짜'} disablePast={true} format={'YYYY년 MM월 DD일'} value={dayjs(dailyLog.logDate)} onChange={(newDate) => setDailyLog({...dailyLog,logDate:newDate?dayjs(newDate).format('YYYY-MM-DD'):dailyLog.logDate})} />
                <Typography sx={{display:{md:'none'}}} ></Typography>
                <MobileTimePicker sx={{marginLeft:'10px', marginRight:'20px', marginBottom:'10px'}} label={'시작 예정 시간'} defaultValue={dayjs(dailyLog.setStartTime)} onChange={(newStartTime) => setDailyLog({...dailyLog,setStartTime:newStartTime?dailyLog.logDate + ' ' + dayjs(newStartTime).format('HH:mm'):dailyLog.setStartTime})} />
                <Typography sx={{display:{md:'none'}}} ></Typography>
                <MobileTimePicker sx={{marginLeft:'10px', marginRight:'20px', marginBottom:'10px'}} label={'종료 예정 시간'} defaultValue={dayjs(dailyLog.setEndTime)} onChange={(newEndTime) => setDailyLog({...dailyLog,setEndTime:newEndTime?dailyLog.logDate + ' ' + dayjs(newEndTime).format('HH:mm'):dailyLog.setEndTime})} />
            </LocalizationProvider>
            <TuiEditor htmlStr={htmlStr} setHtmlStr={setHtmlStr}/>
            <Button fullWidth={true} color={"info"} sx={{marginTop:'6px', color:'antiquewhite'}} size="large" variant="contained" onClick={saveDailyLog}>{'저장'}</Button>
        </Container>
    );
};

export default Write;