import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)

export function formatDate(dateString: Date) {
    const date = dayjs(dateString)

    // If the date is more than a week ago, show the full date
    if (dayjs().diff(date, "day") > 7) {
        return date.format("DD/MM/YYYY")
    }

    // If it's within a week, return relative time with custom formatting
    const diff = dayjs().diff(date, "day")
    if (diff === 1) {
        return "1 day ago"
    } else if (diff > 1) {
        return `${diff} days ago`
    }

    // For other cases like 'a few seconds ago', 'a minute ago', etc.
    return date.fromNow()
}

export function formatDateAndTime(isoString: Date) {
    const date = dayjs(isoString)
    const now = dayjs()

    // If it's today
    if (date.isSame(now, "day")) {
        return `today, ${date.format("HH:mm")}`
    }

    // If it's yesterday
    if (date.isSame(now.subtract(1, "day"), "day")) {
        return `yesterday, ${date.format("HH:mm")}`
    }

    // If it's more than yesterday, show "X days ago"
    if (date.isAfter(now.subtract(7, "days"))) {
        return `${date.fromNow()}, ${date.format("HH:mm")}`
    }

    // If it's more than 7 days ago, show the full date
    return date.format("DD MMM YYYY, HH:mm")
}
