import { useEffect, useMemo, useState } from 'react'

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = (T | U) extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
interface BaseProps {
    // Update interval
    interval?: number
}
export type UseTimeUntilProps = BaseProps & XOR<{
    time: Date
}, {
    delta: number
}>

export const useTimeUntil = ({ time, delta, interval=50 }: UseTimeUntilProps): {
    delta: number,
    seconds: number,
    minutes: number,
    hours: number
} => {
    const [currentTime, setCurrentTime] = useState<number>(Date.now())

    const targetTime = useMemo<number>(() => (
        time ? time.getTime() : new Date(Date.now() + delta!).getTime()
    ), [time, delta])

    // MS until time is reached as an epoch Date
    const timeDeltaNumber = useMemo<number>(() => targetTime - currentTime, [targetTime, currentTime])
    const timeDelta = useMemo<Date>(() => {
        const rounder = timeDeltaNumber > 0 ? Math.floor : Math.ceil
        return new Date(
            rounder(
                Math.abs(timeDeltaNumber) / 1000
            ) * 1000
        )
    }, [timeDeltaNumber])
    const timeUntil = useMemo(() => ({
        delta: timeDeltaNumber,
        seconds: timeDelta.getUTCSeconds(),
        minutes: timeDelta.getUTCMinutes(),
        hours: timeDelta.getUTCHours()
    }), [timeDelta, timeDeltaNumber])

    useEffect(() => {
        const updater = window.setInterval(() => {
            setCurrentTime(Date.now())
        }, interval)
        return () => {
            clearInterval(updater)
        }
    }, [interval])

    return timeUntil
}