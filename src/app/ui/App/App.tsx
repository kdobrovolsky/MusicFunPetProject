
import {Header} from "@/common/components";
import s from "@/app/ui/App/App.module.css"
import {Routing} from "@/common/routing";
import { ToastContainer } from 'react-toastify'

export const App = () => {
    return (
        <>
            <Header />
            <div className={s.layout}>
                <Routing />
            </div>
            <ToastContainer />
        </>
    )
}