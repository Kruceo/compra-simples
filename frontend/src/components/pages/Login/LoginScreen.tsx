import { useState } from "react";
import FormInput from "../../OverPageForm/FormInput";
import { RequiredLabel } from "../../OverPageForm/OverPageForm";
import backend from "../../../constants/backend/backend";
import { useNavigate } from "react-router-dom";
import bg from "../../../assets/bg.jpg"
export default function LoginScreen() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)
        const user = data.get("user")
        const password = data.get("password")

        if (!user) return setError('user')
        if (!password) return setError('password')

        try {
            setMessage("")
            setError("")
            setLoading(true)
            const response = await backend.auth.login(user.toString(), password.toString())
            if (response.error) {
                setLoading(false)
                return setMessage(response.message)
            }
            if (response.token) {
                window.localStorage.setItem("auth-token", response.token)
                // console.warn('500ms cooldown')
                setTimeout(() => {
                    navigate("/")
                }, 500)

            }
        } catch (error) {
            setLoading(false)
            setMessage("Não foi possível se conectar ao servidor.")
        }
    }

    return <div className="flex justify-center items-center h-screen w-screen bg-no-repeat bg-cover" style={{ backgroundImage: `url(${bg})` }}>
        <form onSubmit={submitHandler} className={"flex flex-col w-80 bg-subpanel p-4 border-borders border shadow-xl bg-bottom bg-cover bg-no-repeat " + (loading ? "cursor-wait brightness-50 relative overflow-hidden after:content-[''] after:absolute after:left-0 after:top-0 after:block after:w-full after:h-full after:z-50 after:animate-skeleton-fade" : "")}>
            <h2>Login</h2>
            <RequiredLabel>Usuário</RequiredLabel>
            <FormInput placeholder="Insira seu usuário" name="user" type="text" errored={error == "user"} autoFocus />
            <RequiredLabel>Senha</RequiredLabel>
            <FormInput placeholder="Insira sua senha" name="password" type="password" errored={error == "password"} />
            <FormInput type="submit" value={loading ? "Carregando" : "Entrar"} disabled={loading} />
            <p className="my-4 h-5 text-red-500 text-center">{message}</p>
        </form>
    </div>
}