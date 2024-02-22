import React, { createContext, useState, ReactElement, Dispatch, SetStateAction, PropsWithChildren, useContext } from 'react';
import { GlobalPopupsContext } from './PopupContext';
import { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import statusCodes from '../../constants/statusCodes';


interface ErrorHandlerContextType {
    pageErrorHandler: (axiosResponse: AxiosResponse<any>) => void;
}

export const ErrorHandlerContext = createContext<ErrorHandlerContextType>({
    pageErrorHandler: () => null
})

export default function ErrorHandler(props: PropsWithChildren) {
    const { simpleSpawnInfo,setGlobalPopups } = useContext(GlobalPopupsContext)
    const navigate = useNavigate()
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