import React, {useEffect, useState} from 'react';
import {Button, Card, CardContent, Typography} from "@mui/material";
import dayjs, {Dayjs} from 'dayjs';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {request} from "../utils/util";
import {MobileDatePicker} from "@mui/x-date-pickers";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";
import {useModal} from "../common/ModalContext";

interface DailyLog {
    logSeq: number;
    logTitle: string;
    logContent: string;
    logWriter: string;
    setStartTime: string;
    setEndTime: string;
    startTime: string;
    endTime: string;
}

const Home = () => {
    const navigate = useNavigate();
    const [dailyLogList,setDailyLogList] = useState<DailyLog[]>([]);
    const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
    const {openModal,closeModal} = useModal();

    const dailyLogDetail = (logSeq: number) => {
        console.log(logSeq)
        navigate(`/dailyLog/${logSeq}`, {replace: true})
    }

    const getDailyLogList = async () => {
        if(date){
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            try {
                const res: any = await request<string>(`/user/dailyLog/${dateStr}/list`,
                    {
                        method: 'POST', credentials: 'include', mode: 'cors'
                    });

                const json = await res.json();
                if (json) {
                    setDailyLogList(json);
                } else {
                    console.log('일일업무 데이터 오류')
                    openModal({content:'일일업무 데이터 수신 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
                }
            } catch (error) {
                console.log('일일업무 데이터 요청 실패')
                openModal({content:'일일업무 데이터 요청 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
            }
        }
    }

    useEffect( () => {
        getDailyLogList()
    },[date])

    return (
        <Container sx={{width:'100%', height:{md:'calc(100vh - 350px)',xs:'calc(100vh - 480px)'}}}>
            <Typography align={'center'} variant={"h2"}>
                나의 업무
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{textAlign:'center', verticalAlign:'middle'}}>
                    <Button color={"info"} sx={{marginTop:'6px', color:'antiquewhite'}} size="large" variant="contained" onClick={()=>{setDate(date?date.add(-1,'day'):date)}}>{'<'}</Button>
                    <MobileDatePicker format={'YYYY년 MM월 DD일'} disableFuture={true} value={date} onChange={(newDate) => setDate(newDate)} />
                    <Button color={"info"} sx={{marginTop:'6px', color:'antiquewhite'}} size="large" disabled={dayjs(new Date()).isSame(dayjs(date),'day')} variant="contained" onClick={()=>{setDate(date?date.add(1,'day'):date)}}>{'>'}</Button>
                </div>
            </LocalizationProvider>
            {dailyLogList.length<1?
                <Card sx={{ minWidth: 150 , paddingLeft:'10%', marginBottom:'10px'}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }}>
                            일일업무 데이터가 존재하지 않습니다.
                        </Typography>
                    </CardContent>
                </Card>
                :dailyLogList.map(dailyLog =>
                <Card key={dailyLog.logSeq} sx={{ minWidth: 150 , paddingLeft:'10%', paddingRight:'10%', marginBottom:'10px'}}
                    onClick={event=>dailyLogDetail(dailyLog.logSeq)}
                >
                    <CardContent>
                        <Typography sx={{ fontSize: 14 ,display:'inline'}}>
                            계획 :
                        </Typography>
                        <Typography sx={{ fontSize: 20 ,display:'inline'}}>
                            {(new Date(dailyLog.setStartTime)).getHours()+':'+(new Date(dailyLog.setStartTime)).getMinutes().toString().padStart(2,'0')} ~ {(new Date(dailyLog.setEndTime)).getHours()+':'+(new Date(dailyLog.setEndTime)).getMinutes().toString().padStart(2,'0')}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontSize: 20 ,display:{md:'inline',xs:'block'}, marginLeft:{md:'20px'} }}>
                            {dailyLog.logWriter}
                        </Typography>
                        <Typography variant="h5" component="div" sx={{ fontSize: 20 ,display:{md:'inline',xs:'block'}, marginLeft:{md:'20px'} }}>
                            {dailyLog.logTitle}
                        </Typography>
                        <Typography dangerouslySetInnerHTML={{ __html: dailyLog.logContent.substring(0,200)+(dailyLog.logContent.length>200?'......':'')}} sx={{ mb: 1.5 , fontSize: 14 }} color="text.secondary">
                        </Typography>
                        {dailyLog.startTime?
                            <>
                                <Typography sx={{fontSize: 14, display: 'inline'}}>
                                실행 :
                                </Typography><Typography sx={{fontSize: 20, display: 'inline'}}>
                                    {dailyLog.startTime ? (new Date(dailyLog.startTime)).getHours() + ':' + (new Date(dailyLog.startTime)).getMinutes().toString().padStart(2, '0') : ''} ~ {dailyLog.endTime ? (new Date(dailyLog.endTime)).getHours() + ':' + (new Date(dailyLog.endTime)).getMinutes().toString().padStart(2, '0') : ''}
                                </Typography>
                            </>
                            : ''}
                    </CardContent>
                </Card>
            )}
        </Container>
    );
};

export default Home;