import OverPageInfo from "../Layout/OverPageInfo";
import React, { createContext, useState, ReactElement, Dispatch, SetStateAction, PropsWithChildren } from 'react';

interface PopupContent {
    [key: string]: ReactElement | null;
}

interface GlobalPopupsContextType {
    globalPopups: PopupContent;
    setGlobalPopups: Dispatch<SetStateAction<PopupContent>>;
    setGlobalPopupByKey: (key: string, content: ReactElement | null) => void;
    simpleSpawnInfo: (content: string, onAccept?: Function, onCancel?: Function) => void;
}

const initialPopups: PopupContent = {};

export const GlobalPopupsContext = createContext<GlobalPopupsContextType>({
    globalPopups: initialPopups,
    setGlobalPopups: () => { },
    setGlobalPopupByKey: () => { },
    simpleSpawnInfo: () => { }
});

export default function PopupContext(props: PropsWithChildren) {

    const [globalPopups, setGlobalPopups] = useState<{ [key: string]: React.ReactElement | null }>({});

    function setGlobalPopupByKey(key: string, content: React.ReactElement | null) {
        setGlobalPopups(prevGlobalPopups => {
            const mockup = { ...prevGlobalPopups };
            mockup[key] = content;
            return mockup;
        });
    }
    function simpleSpawnInfo(content: string, onAccept?: Function, onRecuse?: Function) {
        const key = "spawnInfo"
        setGlobalPopupByKey(
            key,
            <OverPageInfo key={key}
                //onAccept existe de qualquer forma, com adendo do argumento, se houver
                onAccept={() => { onAccept ? onAccept() : null; setGlobalPopupByKey(key, null) }}
                //onRecuse só existe se houver o argumento onRecuse 
                onRecuse={onRecuse ? () => { onRecuse(); setGlobalPopupByKey(key, null) } : undefined}

            >
                {content}
            </OverPageInfo>
        )
    }

    return <>
        <GlobalPopupsContext.Provider value={{ globalPopups, setGlobalPopups, simpleSpawnInfo, setGlobalPopupByKey }}>
            {
                Object.entries(globalPopups)
                    .map((each: [string, React.ReactElement | null], index) => <div key={each[0] + index}>
                        {each[1]}
                    </div>)
            }
            {
                props.children
            }
        </GlobalPopupsContext.Provider>
    </>
}