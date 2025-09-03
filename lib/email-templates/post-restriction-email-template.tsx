export function PostRestrictionEmailTemplate({
    authorName,
    postTitle,
    postId,
}: {
    authorName: string
    postTitle: string
    postId: number
}) {
    return (
        <div
            style={{
                fontFamily: "sans-serif",
                maxWidth: "36rem",
                margin: "0 auto",
                padding: "1.5rem",
                backgroundColor: "#f3f4f6",
                borderRadius: "0.5rem",
                color: "#1f2937",
            }}
        >
            <div style={{ textAlign: "center" }}>
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#111827",
                        marginBottom: "0.25rem",
                    }}
                >
                    <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                </h1>
                <p
                    style={{
                        fontSize: "0.825rem",
                        fontWeight: 500,
                        color: "#3b82f6",
                        marginBottom: "1.5rem",
                    }}
                >
                    Idea, Validate, Refine
                </p>
                <h2
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#dc2626",
                    }}
                >
                    Post Content Review Required
                </h2>
            </div>

            <div
                style={{
                    backgroundColor: "#ffffff",
                    padding: "1.5rem",
                    borderRadius: "0.5rem",
                    boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                }}
            >
                <p style={{ marginTop: "1rem" }}>Dear {authorName},</p>
                
                <p style={{ marginTop: "0.5rem" }}>
                    We hope this message finds you well. We&apos;re writing to inform you that your recent post on BlueBizHub requires content review before it can be made visible to other users.
                </p>

                <div
                    style={{
                        backgroundColor: "#fef3c7",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        margin: "1rem 0",
                        border: "1px solid #f59e0b",
                    }}
                >
                    <h3
                        style={{
                            color: "#92400e",
                            margin: "0 0 0.5rem 0",
                            fontSize: "1rem",
                            fontWeight: 600,
                        }}
                    >
                        Post Details:
                    </h3>
                    <p style={{ margin: "0.25rem 0", color: "#92400e" }}>
                        <strong>Title:</strong> {postTitle}
                    </p>
                    <p style={{ margin: "0.25rem 0", color: "#92400e" }}>
                        <strong>Post ID:</strong> #{postId}
                    </p>
                    <p style={{ margin: "0.25rem 0", color: "#92400e" }}>
                        <strong>Status:</strong> Under Review
                    </p>
                </div>

                <p style={{ marginTop: "0.5rem" }}>
                    Your post has been temporarily restricted from public view while we ensure it meets our community guidelines. This is a standard procedure to maintain the quality and safety of our platform.
                </p>

                <h3
                    style={{
                        color: "#374151",
                        fontSize: "1.1rem",
                        fontWeight: 600,
                        marginTop: "1.5rem",
                        marginBottom: "0.5rem",
                    }}
                >
                    What happens next?
                </h3>
                
                <ul style={{ color: "#6b7280", paddingLeft: "1.25rem" }}>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Please review your post content and make any necessary edits
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Once you&apos;ve made your edits, your post will be automatically submitted for our review
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        Our team will review the updated content within 24-48 hours
                    </li>
                    <li style={{ marginBottom: "0.5rem" }}>
                        You&apos;ll receive a notification once your post is approved and made public again
                    </li>
                </ul>

                <div
                    style={{
                        backgroundColor: "#dbeafe",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        margin: "1.5rem 0",
                        border: "1px solid #3b82f6",
                    }}
                >
                    <p style={{ margin: "0", color: "#1e40af" }}>
                        <strong>Need help?</strong> If you have questions about our community guidelines or need assistance with editing your post, please don&apos;t hesitate to contact our support team.
                    </p>
                </div>

                <p style={{ marginTop: "1rem" }}>
                    Thank you for being a valued member of the BlueBizHub community. We appreciate your understanding and cooperation in helping us maintain a high-quality environment for all users.
                </p>

                <p style={{ marginTop: "1rem" }}>
                    Best regards,<br />
                    <strong>The BlueBizHub Team</strong>
                </p>
            </div>

            <div
                style={{
                    textAlign: "center",
                    fontSize: "0.75rem",
                    color: "#9ca3af",
                    marginTop: "1.5rem",
                }}
            >
                &copy; {new Date().getFullYear()}{" "}
                <span
                    style={{
                        fontWeight: "bold",
                    }}
                >
                    <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                </span>
                . All rights reserved.
                <br />
                This is an automated message. Please do not reply to this email. If you need assistance, please contact our support team through the website.
            </div>
        </div>
    )
}