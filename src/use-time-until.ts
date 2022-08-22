import { useEffect, useMemo, useState } from 'react'

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U
  
interface BaseProps {
    // Update interval
    interval?: number
}
interface CountdownProps {
    // Countdown will stop at 0 instead of going into the negatives
    countdown?: boolean
    onFinish?: () => void
}
export type UseTimeUntilProps = BaseProps & CountdownProps & XOR<{
    time: Date
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
    time,
    delta,
    countdown=false,
    onFinish=() => {},
    interval=50
}: UseTimeUntilProps): TimeUntilValue => {
    const [currentTime, setCurrentTime] = useState<number>(Date.now())

    const targetTime = useMemo<number>(() => (
        time ? time.getTime() : new Date(Date.now() + delta!).getTime()
    ), [time, delta])

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
        const updater = window.setInterval(() => {
            setCurrentTime(Date.now())
        }, interval)
        return () => {
            clearInterval(updater)
        }
    }, [interval])

    useEffect(() => {
        if (countdown && finished) onFinish()
    }, [countdown, finished])

    return timeUntil
}