/**
 * Countdown display component
 */
import React, { Fragment } from 'react'
import { useTimeUntil, UseTimeUntilProps } from './use-time-until'

type TimeUntilProps = {
    format?: "text" | "time",
    // Appends "ago" when the time delta is negative
    ago?: boolean
} & UseTimeUntilProps
export const TimeUntil = ({ format="time", ago=false, ...props }: TimeUntilProps) => {
    const { delta, seconds, minutes, hours } = useTimeUntil(props)

    const hoursText = hours !== 1 ? `${ hours } hours` : `1 hour`
    const minutesText = minutes !== 1 ? `${ minutes } minutes` : `1 minute`
    const secondsText = seconds !== 1 ? `${ seconds } seconds` : `1 second`

    const hoursTimeString = hours === 1 ? hours : hours.toString().padStart(2, "0")
    const minutesTimeString = hours === 0 && minutes === 1 ? minutes : minutes.toString().padStart(2, "0")
    const secondsTimeString = seconds.toString().padStart(2, "0")

    if (format === "text") return (
        <Fragment>
            { hours > 0 ? (
                `${ hoursText } and ${ minutesText }`
            ) : minutes > 0 ? (
                `${ minutesText } and ${ secondsText }`
            ) : (
                `${ secondsText }`
            ) }
            { ago && delta < 0 && " ago" }
        </Fragment>
    )
    if (format === "time") return (
        <Fragment>
            { hours > 0 ? hoursTimeString + ":" : "" }{ minutesTimeString }:{ secondsTimeString }
        </Fragment>
    )
    return null
}