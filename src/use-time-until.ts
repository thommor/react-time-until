import { useEffect, useMemo, useState } from 'react'
import { XOR } from './types'
  
interface BaseProps {
    // Update interval. If null, never update.
    interval?: number | null
}
interface CountdownProps {
    // Countdown will stop at 0 instead of going into the negatives
    countdown?: boolean
    onFinish?: () => void
}
export type UseTimeUntilProps = BaseProps & CountdownProps & XOR<{
    date: Date
}, {
    delta: number
}>

export interface TimeUntilValue {
    delta: number,
    seconds: number,
    minutes: number,
    hours: number,
    finished: boolean
}

export const useTimeUntil = ({
    date,
    delta,
    countdown=false,
    onFinish=() => {},
    interval=50
}: UseTimeUntilProps): TimeUntilValue => {
    const [currentTime, setCurrentTime] = useState<number>(Date.now())

    const targetTime = useMemo<number>(() => (
        date ? date.getTime() : new Date(Date.now() + delta!).getTime()
    ), [date, delta])

    // Delta until targetTime is reached
    const timeDeltaNumber = useMemo<number>(() => (
        countdown ? Math.max(0, targetTime - currentTime) : targetTime - currentTime
    ), [targetTime, currentTime, countdown])
    // MS until targetTime is reached as an epoch Date
    const timeDelta = useMemo<Date>(() => {
        const rounder = timeDeltaNumber > 0 ? Math.ceil : Math.floor
        // const rounder = Math.ceil
        return new Date(
            rounder(
                Math.abs(timeDeltaNumber) / 1000
            ) * 1000
        )
    }, [timeDeltaNumber])

    const finished = useMemo(() => (
        timeDeltaNumber <= 0
    ), [timeDeltaNumber])

    const timeUntil = useMemo(() => ({
        delta: timeDeltaNumber,
        seconds: timeDelta.getUTCSeconds(),
        minutes: timeDelta.getUTCMinutes(),
        hours: timeDelta.getUTCHours(),
        finished
    }), [timeDelta, timeDeltaNumber, finished])

    useEffect(() => {
        const updater = interval !== null ? window.setInterval(() => {
            setCurrentTime(Date.now())
        }, interval) : undefined
        return () => {
            window.clearInterval(updater)
        }
    }, [interval])

    useEffect(() => {
        if (countdown && finished) onFinish()
    }, [countdown, finished])

    return timeUntil
}