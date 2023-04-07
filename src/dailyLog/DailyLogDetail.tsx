import React, {useEffect, useState} from 'react';
import {Button, Card, Container, Divider, List, ListItem, ListItemText, TextField, Typography} from "@mui/material";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import dayjs from "dayjs";
import 'dayjs/locale/ko';
import {request} from "../utils/util";
import {useNavigate, useParams} from "react-router-dom";
import {ChipDelete} from "@mui/joy";
import {useModal} from "../common/ModalContext";

interface DailyLog {
    logSeq: number;
    logTitle: string;
    logHtml: string;
    logWriter: string;
    logDate: string;
    setStartTime: string;
    setEndTime: string;
    startTime: string;
    endTime: string;
}
interface DailyLogComment {
    commentSeq: number;
    commentContent: string;
    commentWriter: string;
    mine: boolean;
    regDate: string;
}

const initDailyLog = {
    logSeq:0,
    logTitle: '',
    logHtml: '',
    logWriter: '',
    logDate:'',
    setStartTime: '',
    setEndTime: '',
    startTime: '',
    endTime: ''
}

const DailyLogDetail = () => {
    const navigate = useNavigate();
    const {logSeq} = useParams();
    const {openModal,closeModal} = useModal();
    const [dailyLog,setDailyLog] = useState<DailyLog>(initDailyLog);
    const [dailyLogCommentList,setDailyLogCommentList] = useState<DailyLogComment[]>();
    const [commentContent,setCommentContent] = useState<string>('');
    const [isMine,setIsMine] = useState<boolean>(false);

    const setDailyLogDetail = async () => {
        try {
            const res: any = await request<string>(`/dailyLog/${logSeq}`,
                {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload'
                });

            const json = await res.json();
            if (json.delYn === 'N') {
                if (!json.tenant) {
                    openModal({content:'해당 업무 작성자와 소속이 다릅니다.', type:'alert', callBack:()=>{
                        navigate('/', {replace: true})
                        closeModal()
                    }});
                } else {
                    setIsMine(json.mine)
                    setDailyLog(json)
                    await getDailyLogCommentList()
                }
            } else {
                openModal({content:'삭제된 업무입니다.', type:'alert', callBack:()=>{
                        navigate('/', {replace: true})
                        closeModal()
                    }});
            }
        } catch (error) {
            console.log('일일업무 상세내용 요청 실패')
            openModal({content:'일일업무 상세내용 요청 시 오류가 발생했습니다.', type:'alert', callBack:() => {
                    navigate('/', {replace: true})
                    closeModal()
                }});
        }
    }

    const getDailyLogCommentList = async () => {
        try {
            const res: any = await request<string>(`/dailyLog/${logSeq}/comment`,
                {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload'
                });

            const json = await res.json();
            setDailyLogCommentList(json)
        } catch (error) {
            console.log('일일업무 코멘트 요청 실패')
            // setAlert('일일업무 코멘트 요청 시 오류가 발생했습니다.', true, () => {
            //     navigate('/', {replace: true})
            // });
        }
    }

    const registerDailyLogCommentList = async () => {
        try {
            const res: any = await request<string>(`/dailyLog/${logSeq}/comment`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload',
                    body: commentContent
                });

            const json = await res.json();
            setCommentContent('')
            setDailyLogCommentList(json)
        } catch (error) {
            console.log('일일업무 코멘트 등록 요청 실패')
        }
    }

    const deleteDailyLogComment = async (commentSeq: number) => {
        openModal({content:'코멘트를 삭제 하시겠습니까?', type:'dialog', callBack:async () => {
                try {
                    const res: any = await request<string>(`/dailyLog/${logSeq}/comment/${commentSeq}`,
                        {
                            method: 'DELETE',
                            credentials: 'include',
                            mode: 'cors',
                            cache: 'reload'
                        });

                    const json = await res.json();
                    if(!json.isMine){
                        openModal({content:'내가 작성한 코멘트가 아닙니다.', type:'alert', callBack:() => {closeModal()}});
                    } else {
                        closeModal()
                    }
                    await setDailyLogCommentList(json.commentList)
                } catch (error) {
                    console.log('일일업무 코멘트 삭제 요청 실패')
                }
            }});
    }

    const deleteDailyLog = async () => {
        openModal({content:'해당 업무를 삭제 하시겠습니까?', type:'dialog', callBack:async () => {
                try {
                    const res: any = await request<string>(`/dailyLog/${logSeq}`,
                        {
                            method: 'DELETE',
                            credentials: 'include',
                            mode: 'cors',
                            cache: 'reload'
                        });

                    const json = await res.json();
                    if(!json.isMine){
                        openModal({content:'내가 작성한 업무가 아닙니다.', type:'alert', callBack:() => {closeModal()}});
                    } else {
                        navigate('/', {replace: true})
                        closeModal()
                    }
                } catch (error) {
                    console.log('일일업무 삭제 요청 실패')
                }
            }});
    }

    useEffect(() => {
        setDailyLogDetail()
    },[])


    return (
        <Container sx={{width:'100%', height:{md:'calc(100vh - 350px)',xs:'calc(100vh - 480px)'}}} >
            <Typography align={'center'} variant={"h2"}>
                업무 상세
            </Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', width:'calc(100% - 20px)'}} value={dailyLog.logTitle} label={'업무명'}  aria-readonly={true}></TextField>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px'}} value={dailyLog.logDate} label={'업무일'} aria-readonly={true}></TextField>
            <Typography sx={{display:{md:'none'}}} ></Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px'}} value={dayjs(dailyLog.setStartTime).format('HH:MM')} label={'시작 예정 시간'} aria-readonly={true}></TextField>
            <Typography sx={{display:{md:'none'}}} ></Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px'}} value={dayjs(dailyLog.setEndTime).format('HH:MM')} label={'종료 예정 시간'} aria-readonly={true}></TextField>
            <Typography sx={{}} ></Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px'}} value={dailyLog.startTime?dayjs(dailyLog.startTime).format('HH:MM'):''} label={'시작 시간'} aria-readonly={true}></TextField>
            <Typography sx={{display:{md:'none'}}} ></Typography>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px'}} value={dailyLog.endTime?dayjs(dailyLog.endTime).format('HH:MM'):''} label={'종료 시간'} aria-readonly={true}></TextField>
            <Card dangerouslySetInnerHTML={{ __html: dailyLog.logHtml?dailyLog.logHtml:''}} ></Card>

            <Typography variant={'h5'} sx={{marginTop:'30px'}}>코멘트</Typography>
            <List>
                {dailyLogCommentList&&dailyLogCommentList.length>0?dailyLogCommentList.map((dailyLogComment,index)=>
                        <div key={dailyLogComment.commentSeq}>
                            <ListItem alignItems="flex-start">
                                <ListItemText
                                    primary={`${dailyLogComment.commentWriter} - ${dailyLogComment.regDate}`}
                                    secondary={<>
                                        <Typography
                                        sx={{display: 'inline'}}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {dailyLogComment.commentContent}
                                        <ChipDelete  sx={{float:'right',height:'10px',width:'10px',display:dailyLogComment.mine?'':'none'}} variant={'soft'} color={'danger'} onClick={()=>deleteDailyLogComment(dailyLogComment.commentSeq)}/>
                                    </Typography>
                                    </>
                                }/>
                            </ListItem>
                            <Divider variant="fullWidth" component="li"/>
                        </div>
                ):
                    <>
                        <ListItem alignItems="flex-start">
                            <ListItemText
                                primary="코멘트가 존재하지 않습니다."/>
                        </ListItem><Divider variant="fullWidth" component="li"/>
                    </>
                }
            </List>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', width:'calc(100% - 140px)'}} value={commentContent?commentContent:''} onChange={(event)=>setCommentContent(event.target.value?event.target.value:'')} label={'코멘트 작성'} ></TextField>
            <Button color={"info"} sx={{marginTop:'6px', color:'antiquewhite'}} size="large" variant="contained" onClick={registerDailyLogCommentList} >{'코멘트 등록'}</Button>

            <Button fullWidth={true} color={"info"} sx={{marginTop:'6px', color:'antiquewhite',display:isMine?'':'none'}} size="large" variant="contained" onClick={()=>deleteDailyLog()} >{'삭제'}</Button>
        </Container>
    );
};

export default DailyLogDetail;