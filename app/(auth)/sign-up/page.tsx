"use client"
import React from 'react'
import SignUpForm from './_components/auth-form'
import { Suspense } from 'react'

const SignUp = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
        <SignUpForm />
    </Suspense>
  )
}

export default SignUp;
