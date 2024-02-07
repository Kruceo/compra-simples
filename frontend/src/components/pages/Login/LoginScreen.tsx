import { useState } from "react";
import FormInput from "../../OverPageForm/FormInput";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import backend, { api_address } from "../../../constants/backend";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function LoginScreen() {
    const navigate = useNavigate()

    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        const user = data.get("user")
        const password = data.get("password")

        if (!user) return setError('user')
        if (!password) return setError('password')

        const response = await backend.auth.login(user.toString(), password.toString())

        if (response.error) return setMessage(response.message)

        if (response.token) {
            Cookies.set('token', response.token, { domain: api_address })
            navigate("/")
        }
    }

    return <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
        <form onSubmit={submitHandler} className="flex flex-col w-80 bg-subpanel p-4 border-borders border shadow-xl">
            <h2>Login</h2>
            <RequiredLabel>Usuário</RequiredLabel>
            <FormInput name="user" type="text" errored={error == "user"} />
            <RequiredLabel>Senha</RequiredLabel>
            <FormInput name="password" type="password" errored={error == "password"} />
            <FormInput type="submit" value={"Entrar"} />
            <p className="my-4 h-5 text-red-500 text-center">{message}</p>
        </form>
    </div>
}