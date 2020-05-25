var Client = (() => {
    'use strict';

    let socket = null;

    function init(){
        const socketUrl = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + window.location.hostname + (window.location.port ? ':'+window.location.port : '') + '/story/{{STORY_IFID}}/socket'
        socket = new WebSocket(socketUrl);
        socket.onopen = () => {};
        socket.onmessage = (e) => {
            handleMessage(JSON.parse(e.data));
        };
    }

    function handleMessage(data){
        console.log('received', data);
        switch(data.type){
            case 'playPassage':
                SugarCube.Engine.render(data.passage);
                break;
        }
    }

    function socketSend(data){
        try {
            socket.send(JSON.stringify(data));
        } catch(e) {
            setTimeout(() => {socketSend(data)}, 100); // TODO: actual onopen event
        }
    }

    function sendMessage(message){
        socketSend({
            message,
        });
    }

    function sendInput(inputType, inputId, value) {
        socketSend({
            type: 'input',
            inputType,
            inputId,
            value,
        });
    }

    return {
        socket,
        init,
        sendInput,
    };

})();