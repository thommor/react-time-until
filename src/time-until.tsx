/**
 * Countdown display component
 */
import React, { Fragment, ReactNode } from 'react'
import { TimeUntilValue, useTimeUntil, UseTimeUntilProps } from './use-time-until'

type TimeUntilProps = {
    format?: "text" | "time"
    prefix?: string
    suffix?: string
    andText?: string
    finishText?: ReactNode
} & Partial<UseTimeUntilProps> & Partial<{
    value: TimeUntilValue
}>
export const TimeUntil = ({
    format="text",
    prefix="in ",
    suffix=" ago",
    andText=" and ",
    finishText=undefined,
    value=undefined,
    ...props
}: TimeUntilProps) => {
    const useTimeUntilProps: UseTimeUntilProps = value ? {
        delta: 0,
        interval: null
    } : props as UseTimeUntilProps
    let { delta, seconds, minutes, hours, days, months, years, finished } = useTimeUntil(useTimeUntilProps)
    if (value) ({ delta, seconds, minutes, hours, days, months, years, finished } = value)

    const yearsText = years !== 1 ? `${ years } years` : `1 year`
    const monthsText = months !== 1 ? `${ months } months` : `1 month`
    const daysText = days !== 1 ? `${ days } days` : `1 day`
    const hoursText = hours !== 1 ? `${ hours } hours` : `1 hour`
    const minutesText = minutes !== 1 ? `${ minutes } minutes` : `1 minute`
    const secondsText = seconds !== 1 ? `${ seconds } seconds` : `1 second`

    const daysTimeString = days
    const hoursTimeString = days === 0 && hours === 1 ? hours : hours.toString().padStart(2, "0")
    const minutesTimeString = hours === 0 && minutes === 1 ? minutes : minutes.toString().padStart(2, "0")
    const secondsTimeString = seconds.toString().padStart(2, "0")
    if (props.countdown && finishText && finished) return (
        <Fragment>
            { finishText }
        </Fragment>
    )
    if (format === "text") return (
        <Fragment>
            { delta >= 0 && prefix }
            { years > 0 ? (
                `${ yearsText }${ andText }${ monthsText }`
            ) : months > 0 ? (
                `${ monthsText }${ andText }${ daysText }`
            ) : days > 0 ? (
                `${ daysText }${ andText }${ hoursText }`
            ) : hours > 0 ? (
                `${ hoursText }${ andText }${ minutesText }`
            ) : minutes > 0 ? (
                `${ minutesText }${ andText }${ secondsText }`
            ) : (
                `${ secondsText }`
            ) }
            { delta < 0 && suffix }
        </Fragment>
    )
    if (format === "time") return (
        <Fragment>
            { days > 0 ? (
                daysTimeString + ":"
            ) : "" }
            { hours > 0 ? (
                hoursTimeString + ":"
            ) : "" }
            { minutesTimeString }:{ secondsTimeString }
        </Fragment>
    )
    return null
}