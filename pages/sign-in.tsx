import MainLayout from 'components/layouts/StaticLayout'
import {SignIn, SignUp} from "@clerk/nextjs";
import React from 'react'

const SignInPage = () => {
  return (
    <MainLayout sectionTitle="Sign In To Clerk">
      <SignIn />
    </MainLayout>
  )
}

export default SignInPage