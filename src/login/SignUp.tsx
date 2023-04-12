import React, {SyntheticEvent, useEffect, useState} from 'react';
import {
    Alert,
    AlertColor,
    Autocomplete,
    AutocompleteChangeDetails,
    Button,
    Container,
    TextField,
    Typography
} from "@mui/material";
import {request} from "../utils/util";
import {useModal} from "../common/ModalContext";
import {useNavigate} from "react-router-dom";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {AutocompleteChangeReason} from "@mui/joy";

interface UserInfo {
    userId: string;
    userPwd: string;
    userName: string;
    userTeamSeq: number | null;
    authNum: string;
}
interface TeamInfo {
    teamSeq: number;
    teamName: string;
}

interface TenantInfo {
    tenantHost: string;
    teamList: TeamInfo[]
}

const SignUp = () => {
    const [userInfo,setUserInfo] = useState<UserInfo>({userId:'',userPwd:'',userName:'',userTeamSeq:null,authNum:''})
    const [checkPwd,setCheckPwd] = useState<string>('')
    const [tenantInfo,setTenantInfoList] = useState<TenantInfo>({tenantHost:'',teamList:[]})
    const [emailCheckAlert, setEmailCheckAlert] = useState<string>('잘 못 된 이메일 형식입니다.')
    const [emailCheckType, setEmailCheckType] = useState<AlertColor | undefined>('warning')
    const [passwordCheckAlert, setPasswordCheckAlert] = useState<string>('비밀번호가 일치하지 않습니다.')
    const [passwordCheckType, setPasswordCheckType] = useState<AlertColor | undefined>('warning')
    const [checkExist,setCheckExist] = useState<boolean>(false)
    const [isExist,setIsExist] = useState<boolean>(true)
    const {openModal,closeModal} = useModal()
    const navigate = useNavigate()

    const setInitData = async () => {
        try {
            const res: any = await request<string>(`/login/signUp/initData`,
                {
                    method: 'GET',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload'
                },true);

            const json = await res.json();
            if (json) {
                setTenantInfoList(json);
            } else {
                openModal({content:'회사 정보에 문제가 있습니다.', type:'alert', callBack:()=>{
                        navigate('/', {replace: true})
                        closeModal()
                    }});
            }
        } catch (error) {
            console.log('회사정보 요청 실패')
            openModal({content:'회사정보 요청시 오류가 발생했습니다.', type:'alert', callBack:() => {
                    navigate('/', {replace: true})
                    closeModal()
                }});
        }
    }

    useEffect(() => {
        setInitData()
    },[])

    useEffect(() => {
        setCheckExist(false)
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');
        if(!regex.test(userInfo.userId)){
            setEmailCheckAlert('잘 못 된 이메일 형식입니다.')
            setEmailCheckType('warning')
        } else if(!userInfo.userId.endsWith(tenantInfo.tenantHost)){
            setEmailCheckAlert('회사 이메일이 아닙니다.')
            setEmailCheckType('warning')
        } else {
            setEmailCheckAlert('형식에 맞는 이메일입니다.')
            setEmailCheckType('success')
        }
    },[userInfo.userId])

    useEffect(() => {
        if(userInfo.userPwd.length<1){
            setPasswordCheckType('warning')
            setPasswordCheckAlert('비밀번호를 입력하여 주십시오.')
        } else if(userInfo.userPwd!==checkPwd){
            setPasswordCheckType('warning')
            setPasswordCheckAlert('비밀번호가 일치하지 않습니다.')
        } else {
            setPasswordCheckType('success')
            setPasswordCheckAlert('비밀번호가 확인되었습니다.')
        }
    },[userInfo.userPwd,checkPwd])


    const requestAuthNum = async () => {
        try {
            if(emailCheckType !== 'success'){
                openModal({
                    content: '이메일을 정확히 입력하여 주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(!checkExist){
                openModal({
                    content: '이메일 중복확인을 해주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(isExist){
                openModal({
                    content: '중복된 이메일입니다.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            openModal({
                content: '', type: 'progress', callBack: () => {
                }
            });
            const res: any = await request<string>(`/login/authNumRequest`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload',
                    body: userInfo.userId
                }, true);

            const json = await res.text();
            closeModal()
            if (json === 'success') {
                openModal({
                    content: '메일에서 인증번호를 확인해주세요.', type: 'info', callBack: () => {
                        closeModal()
                    }
                });
            } else {
                openModal({
                    content: '인증번호 정보에 문제가 있습니다.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
            }
        } catch (error) {
            console.log('인증번호 요청 실패')
            openModal({
                content: '인증번호 요청시 오류가 발생했습니다.', type: 'alert', callBack: () => {
                    closeModal()
                }
            });
        }
    }

    const requestSignUp = async () => {
        try {
            if(emailCheckType !== 'success'){
                openModal({
                    content: '이메일을 정확히 입력하여 주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(!checkExist){
                openModal({
                    content: '이메일 중복확인을 해주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(isExist){
                openModal({
                    content: '중복된 이메일입니다.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(passwordCheckType !== 'success'){
                openModal({
                    content: '비밀번호를 확인해 주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(userInfo.userName.length < 1){
                openModal({
                    content: '이름을 입력하여 주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            if(!userInfo.userTeamSeq){
                openModal({
                    content: '부서를 선택하여 주십시오.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
                return;
            }
            const res: any = await request<string>(`/login/signUp`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload',
                    body: JSON.stringify(userInfo),
                    headers: {
                        "Content-Type": "application/json",
                    }
                }, true);

            const json = await res.json();
            openModal({
                content: json.msg, type: json.success?'success':'alert', callBack: () => {
                    if(json.success){
                        navigate('/', {replace: true})
                    }
                    closeModal()
                }
            });
        } catch (error) {
            console.log('회원가입 요청 실패')
            openModal({
                content: '가입 요청시 오류가 발생했습니다.', type: 'alert', callBack: () => {
                    closeModal()
                }
            });
        }
    }

    const requestCheckExist = async () => {
        if(emailCheckType !== 'success'){
            openModal({
                content: '이메일을 정확히 입력하여 주십시오.', type: 'alert', callBack: () => {
                    closeModal()
                }
            });
            return;
        }
        setCheckExist(true)
        try {
            const res: any = await request<string>(`/login/checkExist`,
                {
                    method: 'POST',
                    credentials: 'include',
                    mode: 'cors',
                    cache: 'reload',
                    body: userInfo.userId
                }, true);

            const json = await res.json();
            if (json.success) {
                setIsExist(false)
                openModal({
                    content: '사용가능한 메일입니다.', type: 'success', callBack: () => {
                        closeModal()
                    }
                });
            } else {
                setIsExist(true)
                openModal({
                    content: '중복된 이메일입니다.', type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
            }
        } catch (error) {
            console.log('이메일 중복 확인 요청 실패')
            setCheckExist(false)
            setIsExist(true)
            openModal({
                content: '이메일 중복 확인 요청시 오류가 발생했습니다.', type: 'alert', callBack: () => {
                    closeModal()
                }
            });
        }
    }

    return (
        <Container sx={{width:'100%', height:{md:'calc(100vh - 350px)',xs:'calc(100vh - 480px)'}}}>
            <Typography align={'center'} variant={"h2"}>
                회원 가입
            </Typography>
            <TextField sx={{marginLeft:'10px', width:'calc(100% - 142px)'}} value={userInfo.userId} label={'이메일'} type={"email"} onChange={(event)=>setUserInfo({...userInfo,userId:event.target.value})} ></TextField>
            <Button color={"info"} sx={{marginLeft:'2px', marginTop:'6px', color:'antiquewhite', display:'inline'}} size="large" variant="contained" onClick={requestCheckExist} >{'중복확인'}</Button>
            <Typography align={'center'} sx={{display:'inline', verticalAlign:'middle'}}><ErrorOutlineIcon color={checkExist&&!isExist?'success':'error'}/></Typography>
            <Alert severity={emailCheckType} sx={{marginLeft:'10px'}}>{emailCheckAlert}</Alert>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', marginTop:'20px', width:'100%'}} value={userInfo.userPwd} label={'비밀번호'} type={"password"} onChange={(event)=>setUserInfo({...userInfo,userPwd:event.target.value})} ></TextField>
            <TextField sx={{marginLeft:'10px', width:'100%'}} value={checkPwd} label={'비밀번호 확인'} type={"password"} onChange={(event)=>setCheckPwd(event.target.value)} ></TextField>
            <Alert severity={passwordCheckType} sx={{marginLeft:'10px'}}>{passwordCheckAlert}</Alert>
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', marginTop:'20px', width:'100%'}} value={userInfo.userName} label={'이름'} onChange={(event)=>setUserInfo({...userInfo,userName:event.target.value})} ></TextField>
            <Autocomplete
                options={tenantInfo.teamList?tenantInfo.teamList.map(teamInfo=>{return {label:teamInfo.teamName,id:teamInfo.teamSeq}}):[]}
                sx={{marginLeft:'10px', marginBottom:'20px', marginTop:'20px', width:'100%'}}
                isOptionEqualToValue={(option:{label: string; id: number;}, value:{label: string; id: number;}) => {
                    return option.id === value.id
                }}
                onChange={(event: SyntheticEvent<Element, Event>, value: { label: string; id: number; } | null, reason: AutocompleteChangeReason) => {
                    setUserInfo({...userInfo,userTeamSeq:value?value.id:null})
                }}
                renderInput={(params) => <TextField {...params} label="부서 선택" />}
            />
            <TextField sx={{marginLeft:'10px', marginBottom:'20px', marginTop:'20px', width:'calc(100% - 154px)'}} value={userInfo.authNum} label={'인증번호'} onChange={(event)=>setUserInfo({...userInfo,authNum:event.target.value})} ></TextField>
            <Button color={"info"} sx={{marginLeft:'2px', marginTop:'26px', color:'antiquewhite', display:'inline'}} size="large" variant="contained" onClick={requestAuthNum}>{'인증번호 요청'}</Button>
            <Button color={"success"} sx={{marginTop:'6px', color:'antiquewhite', width:'48%'}} size="large" variant="contained" onClick={requestSignUp}>{'회원가입'}</Button>
            <Typography sx={{width:'4%',display:'inline-block'}}></Typography>
            <Button color={"warning"} sx={{marginTop:'6px', color:'antiquewhite', width:'48%'}} size="large" variant="contained" onClick={()=>navigate('/', {replace: true})}>{'취소'}</Button>
        </Container>
    );
};

export default SignUp;