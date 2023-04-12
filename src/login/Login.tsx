import React, {useState} from 'react';
import {Box, Button, TextField, Typography} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {request} from '../utils/util'
import {useModal} from "../common/ModalContext";

const Login = () => {
    const navigate = useNavigate();
    const {openModal, closeModal} = useModal()

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const loginClick = async () => {
        console.log(email, password);
        const data = {userId: email, userPwd: password};
        try {
            const res:any = await request<string>('/login/signIn',
                {
                    method: 'POST',credentials:'include',mode:'cors',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                },true);

            const json = await res.json();
            if(json.success){
                navigate('/', {replace: true})
            } else {
                openModal({
                    content: json.msg, type: 'alert', callBack: () => {
                        closeModal()
                    }
                });
            }
        } catch (error) {
            console.log('로그인 요청 실패')
            alert('로그인 요청 시 오류가 발생했습니다.');
        }
    }

    const goSignUp = () => {
        navigate('/signUp', {replace: true})
    }

    return (
        <Box
            sx={{
                width: '40%',
                flexDirection: 'column',
                verticalAlign: 'middle',
                position: 'absolute', left: '50%', top: '40%',
                transform: 'translate(-50%, -50%)',
            }}
        >
            <Typography textAlign={"center"}  variant="h1" component="h2">
                일일업무
            </Typography>
            <TextField onChange={(e)=>{setEmail(e.target.value)}} fullWidth id="email" label="E-Mail" variant="outlined" type={"email"} sx={{marginTop:'10px',marginBottom:'10px'}}/>
            <TextField onChange={(e)=>{setPassword(e.target.value)}} onKeyPress={e => {if(e.key === 'Enter') {loginClick()}}} fullWidth id="password" label="Password" variant="outlined" type={"password"} sx={{marginTop:'10px',marginBottom:'10px'}}/>
            <Button fullWidth variant="contained" sx={{marginTop:'10px',marginBottom:'10px'}}
                onClick={loginClick}
            >로그인</Button>
            <Button fullWidth variant="contained" sx={{marginTop:'10px',marginBottom:'10px'}} color={"success"} onClick={goSignUp}>회원가입</Button>
        </Box>
    );
};

export default Login;