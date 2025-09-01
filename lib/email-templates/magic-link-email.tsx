export function MagicLinkEmail({ url }: { url: string }) {
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
                        fontSize: "1rem",
                        fontWeight: 600,
                        color: "#111827",
                    }}
                >
                    Sign in with Magic Link
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
                <p style={{ marginTop: "1rem" }}>Welcome, there!</p>
                <p style={{ marginTop: "0.5rem" }}>
                    You requested to sign in to{" "}
                    <span
                        style={{
                            fontWeight: "bold",
                            color: "#111827",
                        }}
                    >
                        <span style={{ color: "#3b82f6" }}>Blue</span>BizHub
                    </span>
                    . Click the button below to access your account securely.
                </p>
                <p style={{ marginTop: "0.5rem" }}>
                    To activate your account, please verify your email address
                    by clicking the button below:
                </p>
                <div style={{ textAlign: "center", margin: "1.5rem 0" }}>
                    <a
                        href={url}
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
                        ✨ Sign In Now
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
                    If you didn&apos;t request this, you can safely ignore it.
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