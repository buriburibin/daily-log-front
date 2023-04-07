import React from 'react';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './dailyLog/Home';
import Login from './login/Login';
import SignUp from './login/SignIn';
import PrivateRouter from "./route/PrivateRouter";
import Tenant from "./dailyLog/Tenant";
import Write from "./dailyLog/Write";
import AlertPopup from "./common/AlertPopup";
import DailyLogDetail from "./dailyLog/DailyLogDetail";

function App() {
  return (
      <BrowserRouter>
          <AlertPopup/>
          <Routes>
              {/* 인증 여부 상관 없이 접속 가능한 페이지 정의 */}
              {/*<Route index element={<MainPage/>}/>*/}
              {/* 인증을 반드시 하지 않아야만 접속 가능한 페이지 정의 */}
              <Route element={<PrivateRouter authentication={false}/>}>
                  <Route path="/login" element={<Login/>} />
                  <Route path="/signUp" element={<SignUp/>} />
              </Route>
              {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
              <Route element={<PrivateRouter authentication={true}/>}>
                  <Route path="/" element={<Home/>} />
                  <Route path="/tenant" element={<Tenant/>} />
                  <Route path="/write" element={<Write/>} />
                  <Route path="/dailyLog/:logSeq" element={<DailyLogDetail/>} />
              </Route>
          </Routes>
      </BrowserRouter>
  );
}

export default App;