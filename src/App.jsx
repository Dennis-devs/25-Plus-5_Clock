import './App.css'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import{faCirclePlay, faCirclePause, faRotate, faArrowLeft, faArrowRight} from '@fortawesome/free-solid-svg-icons'
import { useRef, useState } from 'react'


function App() {

const [breaker, setBreaker] = useState(5);
const [sessioner, setSessioner] = useState(25);
const [display, setDisplay] = useState(25*60);
const [timerOn, setTimerOn] = useState(false);
const [onBreak, setOnBreak] = useState(false);
const [breakalarm, setBreakAlarm] = useState(new Audio("/AlarmSound.mp3"))
let interval = useRef()
const playAlarm = () => {
  breakalarm.currentTime = 0;
  breakalarm.play();
}

function secs(time){
  let min = Math.floor(time / 60)
  let sec = time % 60
  return (
    (min < 10 ? "0" + min : min) +
    ":" +
    (sec < 10 ? "0" + sec : sec)
  )
}

function ReseterFunc(){
  setBreaker(5)
  setSessioner(25)
  setDisplay(25*60)
  setOnBreak(false)
  clearInterval(interval.current)
}

function BreakFunc1 () {
  return breaker==1 ? 1 : setBreaker(breaker - 1)
}
function BreakFunc2 () {
  return breaker==60 ? 60 : setBreaker(breaker + 1)
}
function SessionFunc1 () {
  if (sessioner==1) {return 1} else setSessioner(sessioner - 1)
  if (!timerOn){setDisplay((sessioner-1) * 60)}
  }
function SessionFunc2 () {
  if (sessioner==60) {return 60} else setSessioner(sessioner + 1)
  if (!timerOn){setDisplay((sessioner+1) * 60)}
}
const TimeControl = () => {
  let second = 1000;
  let date = new Date().getTime();
  let nextDate = new Date().getTime() + second;
  let onbreakvar = onBreak;
  if(!timerOn){
    interval.current = setInterval(()=>{
      date = new Date().getTime();
      if(date > nextDate){
        setDisplay(prev => {
          if(prev<=0 && onBreak == false){
            playAlarm();
            //onbreakvar = true;
            setOnBreak(true);
            return breaker*60
          } else if(prev<=0 && onBreak == true){
            playAlarm();
            //onbreakvar = false;
            setOnBreak(false);
            return sessioner*60
          }
          return prev - 1
        })
        nextDate += second
      }
    }, 30);
    localStorage.clear();
    localStorage.setItem("interval.current-id", interval.current);
  }
  else if(timerOn){
    clearInterval(localStorage.getItem("interval.current-id"))
  }
  setTimerOn(!timerOn);
}

  return (
    <>
      <div>
        <h1>25 + 5 Clock</h1>
      </div>
      <div className="cover row">
        <BreakerFunc  BreakFunc1={BreakFunc1} BreakFunc2={BreakFunc2} breaker={breaker} />
        <SessionFunc  SessionFunc1={SessionFunc1} SessionFunc2={SessionFunc2} sessioner={sessioner} />
      </div>
      <DisplayFunc secs={secs} display={display} onBreak={onBreak}/>
      <ControlsFunc ReseterFunc={ReseterFunc} TimeControl={TimeControl}/>
    </>
  )
}
function BreakerFunc({breaker, BreakFunc1, BreakFunc2}){
    return (
      <div className="break col-md-6">
          <h3 id='break-label'>Break Length</h3>
          <div className='row arrowz1 mx-auto'>
            <div className='col-md-4'>
              <FontAwesomeIcon icon={faArrowLeft} id='break-decrement' onClick={()=>BreakFunc1()} />
            </div>
            <div className='col-md-4'>
              <h3 id='break-length'>{breaker}</h3>
            </div>
            <div className='col-md-4'>
              <FontAwesomeIcon icon={faArrowRight} id='break-increment' onClick={()=>BreakFunc2()} />
            </div>
          </div>
        </div>
    )
}
function SessionFunc({sessioner, SessionFunc1, SessionFunc2}){
  return (
    <div className="session col-md-6">
          <h3 id='session-label' className='mx-auto'>Session Length</h3>
          <div className='row arrowz2 mx-auto'>
            <div className='col-md-4'>
              <FontAwesomeIcon icon={faArrowLeft} id='session-decrement' onClick={()=>SessionFunc1()} />
            </div>
            <div className='col-md-4'>
              <h3 id='session-length'>{sessioner}</h3>
            </div>
            <div className='col-md-4'>
              <FontAwesomeIcon icon={faArrowRight} id='session-increment' onClick={()=>SessionFunc2()} />
            </div>
          </div>
        </div>
  )
}
function DisplayFunc({secs, display, onBreak}){
  return (
    <div className="border border-4 border-success mx-auto py-2 px-3 rounded-4 mt-3" id="timer-lebel">
        <h3 id='timer-label'>{onBreak ? 'Break' : 'Session'}</h3>
        <div id="time-left" className='fs-1 fw-bold'>{secs(display)}</div>
      </div>
  )
}
function ControlsFunc({ReseterFunc, TimeControl}){
  return (
  <div id="controls" className='row mt-3'>
        <div id="start_stop" className='col-md-6 mx-auto me-0 border' onClick={()=>TimeControl()}><FontAwesomeIcon icon={faCirclePlay} className='play' /><FontAwesomeIcon icon={faCirclePause} className='pause '/></div>
        <div id="reset" className='col-md-6 mx-auto ms-0' onClick={()=>ReseterFunc()}><FontAwesomeIcon icon={faRotate} className='reset'/></div>
  </div>
  )
}


export default App
