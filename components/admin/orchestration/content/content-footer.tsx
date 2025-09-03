"use client"

export default function ContentFooter() {
    return (
        <p className='text-sm max-w-xl mx-auto mt-4'>
            To trigger or check status of this process, head over to the{" "}
            <a
                className='text-blue-400 underline'
                href='https://vercel.com/armulees-projects/blue-biz-hub/settings/cron-jobs'
            >
                Vercel Cronjobs Setting
            </a>{" "}
            and change the status to stop posting request to Make (Integromat).
        </p>
    )
}
