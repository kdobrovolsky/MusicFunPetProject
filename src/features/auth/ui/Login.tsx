import {useLoginMutation} from "@/features/auth/api/authApi.ts";
import {Path} from "@/common/routing";

export const Login = () => {
    const[login] = useLoginMutation()

    const loginHandler = () => {
        const redirectUri = import.meta.env.VITE_DOMAIN_ADDRESS + Path.OAuthRedirect

        // Уберите пробелы из URL
        const url = `${import.meta.env.VITE_BASE_URL}/auth/oauth-redirect?callbackUrl=${redirectUri}`

        window.open(url, 'oauthPopup', 'width=500, height=600')

        const receiveMessage = (event: MessageEvent) => {
            if(event.origin !== import.meta.env.VITE_DOMAIN_ADDRESS) return;

            const {code} = event.data
            if (!code) {
                console.error('❌ No code received')
                return
            }

            window.removeEventListener('message', receiveMessage)

            // ✅ Добавьте обработку промиса
            login({code, redirectUri, rememberMe: false})
                .unwrap()
                .then(() => {
                    console.log('✅ Login successful!')
                    // Можно добавить редирект или обновление UI
                })
                .catch((error) => {
                    console.error('❌ Login failed:', error)
                    // Показать ошибку пользователю
                })
        }
        window.addEventListener('message', receiveMessage)

    }

    return (
        <button onClick={loginHandler}>Login</button>
    )
}