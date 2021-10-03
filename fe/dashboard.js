import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import axios from 'axios';
import jwt from 'jsonwebtoken';

function DashboardContent(props) {
    const fileSize = (size) => {
        if (size === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(size) / Math.log(k));
        return parseFloat((size / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    let onDragOver = function (e) {
        e.preventDefault();
    };

    let onDragEnter = function (e) {
        e.preventDefault();
    };

    let onDragLeave = function (e) {
        e.preventDefault();
    };

    function scanFiles(item) {
        //let elem = document.createElement("li");
        //elem.textContent = item.name;
        //container.appendChild(elem);

        if (item.isFile) {
            console.log('file is ' + item.fullPath);
            axios({
                url: '/upload',
                baseurl: 'https://localhost:2337',
                onUploadProgress: function (progressEvent) {
                    
                },
            })
        }

        if (item.isDirectory) {
            let directoryReader = item.createReader();
            console.log('Directory name is ' + item.name);
            //let directoryContainer = document.createElement("ul");
            //container.appendChild(directoryContainer);
            directoryReader.readEntries(function (entries) {
                entries.forEach(function (entry) {
                    scanFiles(entry);
                });
            });
        }
    }

    let onDrop = function (e) {
        e.preventDefault();

        let items = event.dataTransfer.items;

        event.preventDefault();

        for (let i = 0; i < items.length; i++) {
            let item = items[i].webkitGetAsEntry();

            if (item) {
                scanFiles(item);
            }
        }
    };

    return (
        <div className="dashboard_container">
            <div id="dropzone"
                onDragOver={(e) => onDragOver(e)}
                onDragEnter={(e) => onDragEnter(e)}
                onDragLeave={(e) => onDragLeave(e)}
                onDrop={(e) => onDrop(e)}
            >

            </div>
        </div>
    )
};

function DashboardFilesystem(props) {
    return (
        <div className="dashboard_container">
            <p>Hello filesystem with</p>
        </div>
    )
};

function DashboardChatting(props) {
    return (
        <div className="dashboard_container">
            <p>Hello chatting</p>
        </div>
    )
};

function DashboardRouting() {
    let _token_ = window.location.pathname.split('/dashboard/').join('');

    for (let cookie of document.cookie.split('; ')) {
        for (let value of cookie.split('=')) {
            if (value === '__au__') {
                if (value === _token_) {
                    axios({
                        method: 'POST',
                        url: '/login/auth',
                        baseURL: 'https://localhost:2337',
                        timeout: 5000,
                        data: {
                            authId: Buffer.from(value, 'utf8')
                        }
                    }).then(response => {
                        if (response.status == 200 || response.statusText == 'Ok') {
                            return (
                                <BrowserRouter>
                                    <Link to={`/dashboard/${_token_}`}>dashboard</Link>
                                    <Link to={`/dashboard/${_token_}/filesystem`}>dashboard filesystem</Link>
                                    <Link to={`/dashboard/${_token_}/chat`}>dashboard chat</Link>

                                    <Switch>
                                        <Route exact path="/dashboard/:id">
                                            <DashboardContent />
                                        </Route>
                                        <Route exact path="/dashboard/:id/filesystem" children={<DashboardFilesystem />} />
                                        <Route exact path="/dashboard/:id/chat" children={<DashboardChatting />} />
                                    </Switch>
                                </BrowserRouter>
                            )
                        } else {
                            try {
                                axios({
                                    method: 'GET',
                                    url: '/',
                                    baseURL: 'https://localhost:2337'
                                });
                            } catch (e) {
                                console.error(e);
                            }
                        }
                    }).catch(e => console.error(e));
                }
            }
        }
    }

    return (
        <BrowserRouter>
            <Link to={`/dashboard/${_token_}`}>dashboard</Link>
            <Link to={`/dashboard/${_token_}/filesystem`}>dashboard filesystem</Link>
            <Link to={`/dashboard/${_token_}/chat`}>dashboard chat</Link>

            <Switch>
                <Route exact path="/dashboard/:id">
                    <DashboardContent />
                </Route>
                <Route exact path="/dashboard/:id/filesystem" children={<DashboardFilesystem />} />
                <Route exact path="/dashboard/:id/chat" children={<DashboardChatting />} />
            </Switch>
        </BrowserRouter>    
    )
}

function Dashboard(props) {
    return (
        <div>
            <DashboardRouting />
        </div>
    )
}

if (typeof window !== "undefined") {
    ReactDOM.render(
        <Dashboard />,
        document.getElementById("app")
    );
}