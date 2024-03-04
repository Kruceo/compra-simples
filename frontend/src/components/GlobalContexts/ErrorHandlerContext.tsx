import  { createContext, PropsWithChildren, useContext } from 'react';
import { GlobalPopupsContext } from './PopupContext';
import { AxiosResponse } from 'axios';
import statusCodes from '../../constants/statusCodes';


interface ErrorHandlerContextType {
    pageErrorHandler: (axiosResponse: AxiosResponse<any>) => void;
}

export const ErrorHandlerContext = createContext<ErrorHandlerContextType>({
    pageErrorHandler: () => null
})

export default function ErrorHandler(props: PropsWithChildren) {
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    function pageErrorHandler(axiosResponse: AxiosResponse<any>) {

        if (axiosResponse.status === statusCodes.Unauthorized){
            window.location.assign("/login")
            return 
        }

            
        let message = axiosResponse.data.message ?? axiosResponse.statusText
        simpleSpawnInfo(message)
    }

    return <>
        <ErrorHandlerContext.Provider value={{ pageErrorHandler }}>
            {props.children}
        </ErrorHandlerContext.Provider>
    </>
}