import React from "react";
import sha256 from 'crypto-js/sha256';
import { BaseContext } from './context.js';

export function Login({ staticContext }) {
    const { csrfToken } = staticContext;

    let onSubmit = function (event) {
        event.preventDefault();

        const isSanitized = /[^<>!@$%\/\s]/gm;
        const isStandardPassword = /^[A-Z]{1}(\w+|\d+)[_!]{1}/gm;

        console.log("submitted")

        var username = event.target.elements['username'];
        var password = event.target.elements['password'];

        if (isSanitized.test(username) && username.length > 5 && password.length > 8 && isStandardPassword.test(password)) {
            event.target.submit();
        }
    }

    return <BaseContext>
        <form method='POST' action='/login' onSubmit={(e) => onSubmit(e)}>
            <input type="hidden" name="_csrf" id="_csrf" value={csrfToken} />
            <label for="username">Username: </label>
            <input type='text' id='username' name='username' placeholder='username' />
            <br /><br />
            <label for="password">Password: </label>
            <input type='password' id='password' name='password' placeholder='password' />
            <br /><br />
            <button type="submit">Go</button>
        </form>
    </BaseContext>
}