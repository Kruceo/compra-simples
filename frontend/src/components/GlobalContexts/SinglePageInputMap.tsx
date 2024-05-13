import React, { createContext, useState, PropsWithChildren, useEffect } from 'react';

interface SinglePageInputMapContextType {
    setPathKeyHandler: (handler: React.KeyboardEventHandler) => void
}

export const SinglePageInputMapContext = createContext<SinglePageInputMapContextType>({
    setPathKeyHandler: () => null
});

export default function SinglePageInputMap(props: PropsWithChildren) {

    const [handler, setHandler] = useState<{ p: string, h: React.KeyboardEventHandler }>({ p: "", h: () => null })
    function createPathKeyListeners(eventHandler: any) {
        setHandler({ p: window.location.pathname, h: eventHandler })
    }


    // const [oldHandler, setOldHandler] = useState<EventListenerOrEventListenerObject>(() => null)


    const [currentEvent, setCurrentEvent] = useState<KeyboardEvent | null>(null)

    useEffect(() => {
        window.addEventListener("keyup", setCurrentEvent)
    }, [])

    useEffect(() => {
        const h = (e: any) => {
            if (!e) return console.log("returned");
            if (window.location.pathname === handler.p) {
                handler.h(e)
            }
        }

        if (currentEvent)
            h(currentEvent)

        return
    }, [currentEvent])

    return <>
        <SinglePageInputMapContext.Provider value={{ setPathKeyHandler: createPathKeyListeners }}>
            {props.children}
        </SinglePageInputMapContext.Provider>
    </>
}