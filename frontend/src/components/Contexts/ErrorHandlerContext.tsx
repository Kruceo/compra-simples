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
    const { simpleSpawnInfo } = useContext(GlobalPopupsContext)
    const navigate = useNavigate()
    function pageErrorHandler(axiosResponse: AxiosResponse<any>) {

        switch (axiosResponse.status) {
            case statusCodes.Unauthorized:
                navigate('/login')
                break;

            default:
                break;
        }
        simpleSpawnInfo(axiosResponse.statusText)
    }

    return <>
        <ErrorHandlerContext.Provider value={{ pageErrorHandler }}>
            {props.children}
        </ErrorHandlerContext.Provider>
    </>
}