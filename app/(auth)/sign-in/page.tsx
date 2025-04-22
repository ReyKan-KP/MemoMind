import SignInForm from "@/app/(auth)/sign-in/_components/auth-form"
import { Suspense } from "react"

const SignIn = () => {
    return (
        <div className="">
            <Suspense fallback={<div>Loading...</div>}>
                <SignInForm />
            </Suspense>
        </div>
    )
}

export default SignIn;