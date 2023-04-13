import React, {useEffect, useRef, useState} from 'react';
import {Box, Button, Card, CardActions, CardContent, Grid, Paper, styled, Typography} from "@mui/material";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {MobileDatePicker} from "@mui/x-date-pickers";
import dayjs, {Dayjs} from "dayjs";
import Container from "@mui/material/Container";
import {useNavigate} from "react-router-dom";
import {useModal} from "../common/ModalContext";
import {request} from "../utils/util";
import { Element } from 'react-scroll';

interface TeamInfo {
    teamSeq: number;
    teamName: string;
    userInfoList: UserInfo[];
}
interface UserInfo {
    userId: string;
    userName: string;
    dailyLogList: DailyLog[];
}
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

const Tenant = () => {
    const navigate = useNavigate();
    const [date, setDate] = useState<Dayjs | null>(dayjs(new Date()));
    const {openModal,closeModal} = useModal();
    const [teamList,setTeamList] = useState<TeamInfo[]>([]);
    const container = useRef<HTMLDivElement>(null);
    const [useAutoScroll,setUseAutoScroll] = useState<boolean>(false);

    const dailyLogDetail = (logSeq: number) => {
        console.log(logSeq)
        navigate(`/dailyLog/${logSeq}`, {replace: true})
    }

    const getTenantDailyLogList = async () => {
        if(date){
            const dateStr = dayjs(date).format('YYYY-MM-DD');
            try {
                const res: any = await request<string>(`/tenant/dept/user/dailyLog/${dateStr}/list`,
                    {
                        method: 'GET', credentials: 'include', mode: 'cors', cache: 'reload'
                    });

                const json = await res.json();
                if (json) {
                    setTeamList(json);
                } else {
                    console.log('전사 일일업무 데이터 오류')
                    openModal({content:'일일업무 데이터 수신 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
                }
            } catch (error) {
                console.log('전사 일일업무 데이터 요청 실패')
                openModal({content:'일일업무 데이터 요청 시 오류가 발생했습니다.', type:'alert', callBack:()=>{closeModal()}});
            }
        }
    }

    useEffect( () => {
        getTenantDailyLogList()
    },[date])

    useEffect(() => {
        let polling = setInterval(() => {
            getTenantDailyLogList();
        }, 60000);

        return () => {
            clearInterval(polling);
        };
    }, []);

    function scrollHorizontally() {
        if(container != null && container.current != null){
            if (container.current.scrollLeft+1 <= container.current.scrollWidth - container.current.clientWidth) {
                container.current.scrollLeft += 10;
            } else {
                container.current.scrollLeft -= container.current.clientWidth;
            }
        }
    }

    useEffect(() => {
        let scrolling: NodeJS.Timer|null = null;
        if(useAutoScroll){
            scrolling = setInterval(() => {
                scrollHorizontally();
            }, 1000);
        } else {
            if(scrolling){
                clearInterval(scrolling);
            }
        }

        return () => {
            if(scrolling){
                clearInterval(scrolling);
            }
        };
    }, [useAutoScroll]);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        margin: '2px'
    }));

    return (
        <>
            <Typography align={'center'} variant={"h2"}>
                전사 업무
            </Typography>
            <Button color={"info"} sx={{position:'absolute', top:'70px', right:'5px'}} size="small" variant="contained"
                    onClick={() => {
                        setUseAutoScroll(!useAutoScroll)
                    }}>자동스크롤</Button>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <div style={{textAlign: 'center', verticalAlign: 'middle'}}>
                    <Button color={"info"} sx={{marginTop: '6px', color: 'antiquewhite'}} size="large" variant="contained"
                            onClick={() => {
                                setDate(date ? date.add(-1, 'day') : date);
                            }}>{'<'}</Button>
                    <MobileDatePicker format={'YYYY년 MM월 DD일'} disableFuture={true} value={date}
                                      onChange={(newDate) => setDate(newDate)}/>
                    <Button color={"info"} sx={{marginTop: '6px', color: 'antiquewhite'}} size="large"
                            disabled={dayjs(new Date()).isSame(dayjs(date), 'day')} variant="contained" onClick={() => {
                        setDate(date ? date.add(1, 'day') : date);
                    }}>{'>'}</Button>
                </div>
            </LocalizationProvider>
            {teamList.length<1?
                <Card sx={{ minWidth: 500 , paddingLeft:'10%', marginBottom:'10px'}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 20 }}>
                            부서가 존재하지 않습니다.
                        </Typography>
                    </CardContent>
                </Card>:
                    <Grid container component={'div'} ref={container} overflow={"auto"} flexWrap={"nowrap"} height={'calc(100vh - 200px)'}>
                        {teamList.map(teamInfo=>
                            <Grid key={teamInfo.teamSeq}>
                                <Item sx={{fontSize:'30px', fontWeight:'bold'}}>{teamInfo.teamName}</Item>
                                {teamInfo.userInfoList.length<1?
                                    <Card sx={{ minWidth: 500 }}>
                                        <CardContent>
                                            <Typography sx={{ fontSize: 20 }}>
                                                직원이 존재하지 않습니다.
                                            </Typography>
                                        </CardContent>
                                    </Card>:
                                    <Grid container overflow={"visible"} flexWrap={"nowrap"}>
                                        {teamInfo.userInfoList.map(userInfo=>
                                            <Grid key={userInfo.userId}>
                                                <Item sx={{fontSize:'20px', fontWeight:'bold'}}>{userInfo.userName}</Item>
                                                {userInfo.dailyLogList.length<1?
                                                    <Card sx={{ minWidth: 500 }}>
                                                        <CardContent>
                                                            <Typography sx={{ fontSize: 20 }}>
                                                                일일업무 데이터가 존재하지 않습니다.
                                                            </Typography>
                                                        </CardContent>
                                                    </Card>:
                                                    userInfo.dailyLogList.map(dailyLog =>
                                                        <Card key={dailyLog.logSeq} sx={{ minWidth: 500, margin:'2px'}}
                                                              onClick={event=>dailyLogDetail(dailyLog.logSeq)}
                                                        >
                                                            <CardContent>
                                                                <Typography sx={{ fontSize: 14,display:'inline'}}>
                                                                    계획 :
                                                                </Typography>
                                                                <Typography sx={{ fontSize: 20,display:'inline'}}>
                                                                    {(new Date(dailyLog.setStartTime)).getHours()+':'+(new Date(dailyLog.setStartTime)).getMinutes().toString().padStart(2,'0')} ~ {(new Date(dailyLog.setEndTime)).getHours()+':'+(new Date(dailyLog.setEndTime)).getMinutes().toString().padStart(2,'0')}
                                                                </Typography>
                                                                <Typography variant="h5" component="div" sx={{ fontSize: 20 }}>
                                                                    {dailyLog.logTitle}
                                                                </Typography>
                                                                <Typography dangerouslySetInnerHTML={{ __html: dailyLog.logContent.substring(0,200)+(dailyLog.logContent.length>200?'......':'')}} sx={{ mb: 1.5 , fontSize: 14 }} color="text.secondary">
                                                                </Typography>
                                                                {dailyLog.startTime?
                                                                    <>
                                                                        <Typography sx={{fontSize: 14,display:'inline'}}>
                                                                            실행 :
                                                                        </Typography>
                                                                        <Typography sx={{fontSize: 20,display:'inline'}}>
                                                                            {dailyLog.startTime ? (new Date(dailyLog.startTime)).getHours() + ':' + (new Date(dailyLog.startTime)).getMinutes().toString().padStart(2, '0') : ''} ~ {dailyLog.endTime ? (new Date(dailyLog.endTime)).getHours() + ':' + (new Date(dailyLog.endTime)).getMinutes().toString().padStart(2, '0') : ''}
                                                                        </Typography>
                                                                    </>
                                                                    : ''}
                                                            </CardContent>
                                                        </Card>
                                                    )}
                                            </Grid>
                                        )}
                                    </Grid>
                                }
                            </Grid>
                        )}
                    </Grid>
                // <div>
                //     {teamList.map(teamInfo =>
                //         <table key={teamInfo.teamSeq} style={{display:'inline-block', border:'1px solid black'}}>
                //             <p style={{textAlign: 'center'}}>{teamInfo.teamName}</p>
                //             {teamInfo.userInfoList.length < 1 ?
                //                 <p>
                //                     <Typography sx={{fontSize: 20}}>
                //                         직원이 존재하지 않습니다.
                //                     </Typography>
                //                 </p> :
                //                 <p style={{display:'inline-block'}}>
                //                     {teamInfo.userInfoList.map(userInfo =>
                //                         <p style={{display:'inline-block', border:'1px solid black'}}>
                //                             <p style={{textAlign: 'center'}}>{userInfo.userName}</p>
                //                             {userInfo.dailyLogList.length < 1 ?
                //                                 <p>
                //                                     <Typography sx={{fontSize: 20}}>
                //                                         일일업무 데이터가 존재하지 않습니다.
                //                                     </Typography>
                //                                 </p> :
                //                                 userInfo.dailyLogList.map(dailyLog =>
                //                                     <p key={dailyLog.logSeq} onClick={event => dailyLogDetail(dailyLog.logSeq)}>
                //                                         <Typography sx={{fontSize: 14, display: 'inline'}}>
                //                                             계획 :
                //                                         </Typography>
                //                                         <Typography sx={{fontSize: 20, display: 'inline'}}>
                //                                             {(new Date(dailyLog.setStartTime)).getHours() + ':' + (new Date(dailyLog.setStartTime)).getMinutes().toString().padStart(2, '0')} ~ {(new Date(dailyLog.setEndTime)).getHours() + ':' + (new Date(dailyLog.setEndTime)).getMinutes().toString().padStart(2, '0')}
                //                                         </Typography>
                //                                         <Typography variant="h5" component="div" sx={{
                //                                             fontSize: 20,
                //                                             display: {md: 'inline', xs: 'block'},
                //                                             marginLeft: {md: '20px'}
                //                                         }}>
                //                                             {dailyLog.logWriter}
                //                                         </Typography>
                //                                         <Typography variant="h5" component="div" sx={{
                //                                             fontSize: 20,
                //                                             display: {md: 'inline', xs: 'block'},
                //                                             marginLeft: {md: '20px'}
                //                                         }}>
                //                                             {dailyLog.logTitle}
                //                                         </Typography>
                //                                         <Typography
                //                                             dangerouslySetInnerHTML={{__html: dailyLog.logContent.substring(0, 200) + (dailyLog.logContent.length > 200 ? '......' : '')}}
                //                                             sx={{mb: 1.5, fontSize: 14}} color="text.secondary">
                //                                         </Typography>
                //                                         {dailyLog.startTime ?
                //                                             <>
                //                                                 <Typography
                //                                                     sx={{fontSize: 14, display: 'inline'}}>
                //                                                     실행 :
                //                                                 </Typography><Typography
                //                                                 sx={{fontSize: 20, display: 'inline'}}>
                //                                                 {dailyLog.startTime ? (new Date(dailyLog.startTime)).getHours() + ':' + (new Date(dailyLog.startTime)).getMinutes().toString().padStart(2, '0') : ''} ~ {dailyLog.endTime ? (new Date(dailyLog.endTime)).getHours() + ':' + (new Date(dailyLog.endTime)).getMinutes().toString().padStart(2, '0') : ''}
                //                                             </Typography>
                //                                             </>
                //                                             : ''}
                //                                     </p>
                //                                 )}
                //                         </p>
                //                     )}
                //                 </p>
                //             }
                //         </table>
                //     )}
                // </div>
            }
        </>
    );
};

export default Tenant;