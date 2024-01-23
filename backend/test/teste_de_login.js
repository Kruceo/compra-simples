fetch('localhost:8080/auth/login', {
    method: "POST",
    body:JSON.stringify({user:'admin',password:"admin"}),
    headers: {
        "Content-Type":"application/json",
        cookie: "token=100101001"
    }
}).then(res => res.json().then((data) => console.log(data)))

fetch('localhost:8080/v1/botes', {
    headers: {
        cookie: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiYWRtaW4iLCJpZCI6MSwiaWF0IjoxNzA2MDE4NzQ4LCJleHAiOjE3MDYwMTg4MDh9.6-i3FP1a5Ay3KpRHBOJnvA9e-2-fYWVBrQ3F9pVW_6s"
    }
}).then(res => res.json().then((data) => console.log(data)))