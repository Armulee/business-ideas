export function ForgetPasswordEmailTemplate({
    name,
    resetUrl,
}: {
    name: string | null
    resetUrl: string
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
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#111827",
                    }}
                >
                    <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                </h1>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.675rem",
                        fontWeight: 500,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(4px)",
                        color: "#3b82f6",
                        marginTop: "0.5rem",
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        style={{ marginRight: "0.5rem" }}
                    >
                        <path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'></path>
                    </svg>
                    Idea, Validate, Refine
                </span>
                <h2
                    style={{
                        fontSize: "1.25rem",
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    Password Reset Request
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
                <p style={{ marginTop: "1rem" }}>Hi {name || "there"},</p>
                <p style={{ marginTop: "0.5rem" }}>
                    We received a request to reset the password associated with
                    this email address. If you made this request, please click
                    the button below to set a new password:
                </p>

                <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                    <a
                        href={resetUrl}
                        style={{
                            backgroundColor: "#3b82f6",
                            color: "#ffffff",
                            padding: "0.75rem 1.25rem",
                            borderRadius: "0.375rem",
                            fontSize: "1rem",
                            fontWeight: 500,
                            textDecoration: "none",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        Reset Password
                    </a>
                </div>

                <p>
                    If you didn’t request this, you can safely ignore this
                    email. Your current password will remain unchanged.
                </p>
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginTop: "1rem",
                    }}
                >
                    This link will expire in 24 hours for the security purpose.
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
                You received this email because you have an account with us.
            </div>
        </div>
    )
}

export function VerifyEmailTemplate({
    name,
    verifyUrl,
}: {
    name: string | null
    verifyUrl: string
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
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                <h1
                    style={{
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#111827",
                    }}
                >
                    <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                </h1>
                <span
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "9999px",
                        fontSize: "0.675rem",
                        fontWeight: 500,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(4px)",
                        color: "#3b82f6",
                        marginTop: "0.5rem",
                    }}
                >
                    <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        style={{ marginRight: "0.5rem" }}
                    >
                        <path d='M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z'></path>
                    </svg>
                    Idea, Validate, Refine
                </span>
                <h2
                    style={{
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    Email Verification
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
                <p style={{ marginTop: "1rem" }}>Welcome, {name || "there"}!</p>
                <p style={{ marginTop: "0.5rem" }}>
                    Thank you for signing up with{" "}
                    <span
                        style={{
                            fontWeight: "bold",
                            color: "#111827",
                        }}
                    >
                        <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                    </span>
                    . We&apos;re excited to have you join our community of
                    innovators and entrepreneurs.
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                    To activate your account, please verify your email address
                    by clicking the button below:
                </p>
                <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                    <a
                        href={verifyUrl}
                        style={{
                            backgroundColor: "#3b82f6",
                            color: "#ffffff",
                            padding: "0.75rem 1.25rem",
                            borderRadius: "0.375rem",
                            fontSize: "1rem",
                            fontWeight: 500,
                            textDecoration: "none",
                            display: "inline-block",
                            transition: "background-color 0.2s ease",
                        }}
                    >
                        Verify Email
                    </a>
                </div>
                <p
                    style={{
                        fontSize: "0.875rem",
                        color: "#6b7280",
                        marginTop: "1rem",
                    }}
                >
                    This link will expire in 24 hours for the security purpose.
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
                You received this email because you have an account with us.
            </div>
        </div>
    )
}
