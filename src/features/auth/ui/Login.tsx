import {useLoginMutation} from "@/features/auth/api/authApi.ts";
import {Path} from "@/common/routing";

export const Login = () => {
    const[login] = useLoginMutation()

    const loginHandler = () => {
        const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        // Уберите пробелы из URL
        const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${encodeURIComponent(redirectUri)}`

        window.open(url, 'oauthPopup', 'width=500, height=600')

        const receiveMessage = (event: MessageEvent) => {
          if(event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return;

            const {code} = event.data
            if (!code) return

            window.removeEventListener('message', receiveMessage)
            login({code, redirectUri, rememberMe: false}) // используйте реальный code
        }

        window.addEventListener('message', receiveMessage)

    }

    return (
        <button onClick={loginHandler}>Login</button>
    )
}