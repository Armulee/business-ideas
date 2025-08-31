"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    
    const contactId = searchParams.get("contactId")
    const email = searchParams.get("email")
    const name = searchParams.get("name")

    return (
        <section className="py-8 space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="button"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Contacts
                </Button>
                <h1 className="text-3xl font-bold text-white">
                    Reply to Contact
                </h1>
            </div>

            <Card className="glassmorphism bg-transparent border-white/10">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Composition
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            To:
                        </label>
                        <div className="glassmorphism px-4 py-2 text-white">
                            {name} ({email})
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-white/70 text-sm mb-2">
                            Contact ID:
                        </label>
                        <div className="glassmorphism px-4 py-2 text-white/60 text-sm">
                            {contactId}
                        </div>
                    </div>

                    <div className="text-center py-12">
                        <Mail className="h-16 w-16 text-white/40 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">
                            Email Composition Coming Soon
                        </h3>
                        <p className="text-white/60">
                            This is a placeholder page for the email reply functionality.
                            The email composition interface will be implemented here.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </section>
    )
}