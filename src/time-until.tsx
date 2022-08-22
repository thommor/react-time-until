/**
 * Countdown display component
 */
import React, { Fragment, ReactNode } from 'react'
import { TimeUntilValue, useTimeUntil, UseTimeUntilProps } from './use-time-until'

type TimeUntilProps = {
    format?: "text" | "time"
    // Prepends "in"/appends "ago"
    // Only supported for "text" format
    ago?: boolean
    inText?: string
    agoText?: string
    finishText?: ReactNode
} & Partial<UseTimeUntilProps> & Partial<{
    value: TimeUntilValue
}>
export const TimeUntil = ({
    format="text",
    ago=false,
    inText="in ",
    agoText=" ago",
    finishText=undefined,
    value=undefined,
    ...props
}: TimeUntilProps) => {
    const useTimeUntilProps: UseTimeUntilProps = value ? {
        delta: 0,
        interval: null
    } : props as UseTimeUntilProps
    let { delta, seconds, minutes, hours, finished } = useTimeUntil(useTimeUntilProps)
    if (value) ({ delta, seconds, minutes, hours, finished } = value)

    const hoursText = hours !== 1 ? `${ hours } hours` : `1 hour`
    const minutesText = minutes !== 1 ? `${ minutes } minutes` : `1 minute`
    const secondsText = seconds !== 1 ? `${ seconds } seconds` : `1 second`

    const hoursTimeString = hours === 1 ? hours : hours.toString().padStart(2, "0")
    const minutesTimeString = hours === 0 && minutes === 1 ? minutes : minutes.toString().padStart(2, "0")
    const secondsTimeString = seconds.toString().padStart(2, "0")
    if (props.countdown && finishText && finished) return (
        <Fragment>
            { finishText }
        </Fragment>
    )
    if (format === "text") return (
        <Fragment>
            { ago && delta >= 0 && inText }
            { hours > 0 ? (
                `${ hoursText } and ${ minutesText }`
            ) : minutes > 0 ? (
                `${ minutesText } and ${ secondsText }`
            ) : (
                `${ secondsText }`
            ) }
            { ago && delta < 0 && agoText }
        </Fragment>
    )
    if (format === "time") return (
        <Fragment>
            { hours > 0 ? hoursTimeString + ":" : "" }{ minutesTimeString }:{ secondsTimeString }
        </Fragment>
    )
    return null
}