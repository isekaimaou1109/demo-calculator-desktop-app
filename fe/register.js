import React from "react";

import { BaseContext } from './context.js';

export function Register({ staticContext }) {
    const { csrfToken } = staticContext;

    return <BaseContext>
        <form method='POST' action='/register'>
            <input type="hidden" name="_csrf" id="_csrf" value={csrfToken} />
            <label for="firstname">Firstname: </label>
            <input type='text' id='firstname' name='firstname' placeholder='firstname' />
            <br /><br />
            <label for="lastname">Lastname: </label>
            <input type='text' id='lastname' name='lastname' placeholder='lastname' />
            <br /><br />
            <label for="email">Email: </label>
            <input type='email' id='email' name='email' placeholder='email' />
            <br /><br />
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