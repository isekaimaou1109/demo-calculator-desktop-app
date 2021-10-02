import React from "react";

import { BaseContext } from './context.js';

export default function App() {
    return <BaseContext>
        <a href="/login">Login</a>
        <br /><br />
        <a href="/register">Register</a>
        <br /><br />
        <a href="/login/auth/facebook">Sign In with FB</a>
        <br /><br />
    </BaseContext>
}
