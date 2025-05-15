import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"

export default function VerificationPage() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-16rem)]">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-16 w-16 text-green-600" />
          </div>

          <h1 className="text-2xl font-bold mb-2">Check your email</h1>

          <p className="text-gray-600 mb-6">
            We've sent a verification link to your email address. Please check your inbox and click the link to verify
            your account.
          </p>

          <div className="space-y-4">
            <Link href="/auth/login">
              <Button className="w-full bg-green-600 hover:bg-green-700">Go to Login</Button>
            </Link>

            <p className="text-sm text-gray-500">
              Didn't receive an email?{" "}
              <button className="text-green-600 hover:text-green-700">Resend verification email</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
