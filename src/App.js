import React, { Component } from 'react';
import { Container } from 'reactstrap';
import { getTokenOrRefresh } from './token_util';
import './custom.css'
import pic from "./assets/WhatsApp Image 2022-05-19 at 11.15.56 AM (1).jpeg"


const speechsdk = require('microsoft-cognitiveservices-speech-sdk')

export default class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            displayText: ['Press start to start listening conversation...']
        }
    }
    
    async componentDidMount() {
        // check for valid speech key/region
        const tokenRes = await getTokenOrRefresh();
        if (tokenRes.authToken === null) {
            this.setState({
                displayText: [tokenRes.error]
            });
        }
    }

    async sttFromMic() {
        const tokenObj = await getTokenOrRefresh();
        const speechConfig = speechsdk.SpeechConfig.fromAuthorizationToken(tokenObj.authToken, tokenObj.region);
        speechConfig.speechRecognitionLanguage = 'en-US';
        
        const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
        const recognizer = new speechsdk.SpeechRecognizer(speechConfig, audioConfig);

        this.setState({
            displayText: ['Listening...'],
            
        });

        recognizer.startContinuousRecognitionAsync(res=>{
            console.log("started recognizing.........",res)
        },e=>{
            console.log("error",e)
        })

        recognizer.recognized = (e,event)=>{
            // console.log("recognized text",e.translations)
            console.log("recognized text",event.privResult.privText)
            if(event.privResult.privText){
                console.log("here......................")
                this.setState({
                    displayText: [...this.state.displayText,event.privResult.privText],                    
                });

                // setPhrases(prevPhrases => [...prevPhrases,event.privResult.privText])
                // conversion(event.privResult.privText)

            }
        }

        recognizer.recognizing = (e,event)=>{
            console.log("recognizing text",e.translations)
            console.log("recognizing text",event.privResult.privText)
        }
        
        recognizer.sessionStarted = (e)=>{
            console.log("session started",e)
            
        }

        recognizer.sessionStopped= (e)=>{
            console.log("session stopped",e)
        }   
    }

    render() {
        return (
            <Container className="app-container">
                <div className="backimg"><img className='picback' src={pic} width="100%" height="100%"/></div>
                <div className="row main-container">
                    <div className="col-6">
                        <i className="fas fa-microphone fa-lg mr-2" onClick={() => this.sttFromMic()}></i>
                        <div className='start-text'>Start</div>
                    </div>
                    <div className="col-6 output-display rounded">
                        {this.state.displayText.map(txt=>{
                            return <code key={new Date().getTime() + txt}>{txt}</code>
                        })}                        
                    </div>
                </div>
            </Container>
        );
    }
}