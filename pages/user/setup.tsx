import Footer from 'components/containers/Footer'
import { useToast } from 'components/context/ToastContextProvider'
import Section from 'components/ui/section'
import Toasts from 'components/ui/toasts'
import { useSession } from 'hooks/useSession'
import React, { useRef, useState } from 'react'

import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import useDebug from 'hooks/useDebug'
import UserBillingDetail from 'components/containers/User/UserBillingDetail'
import { UserNameAndAvatar } from 'components/containers/User/UserNameAndAvatar'
import EZButton from 'components/ui/ezButton'
import ShrinkableLink from 'components/ui/shrinkableLink'
import useApi from 'prisma/useApi'

const {debug} = useDebug('user/setup')

const SetupPage = () => {
  useSession({ required: true, redirectTo: '/login' })
  const {cyfrUser, isLoading, error, invalidate, updateUser} = useApi.cyfrUser()
  const {notify} = useToast()

  const mainRef = useRef<HTMLElement>(null)
  const [scrollActive, setScrollActive] = useState(false)
  const handleScroll = (e: any) => {
    const position = mainRef?.current?.scrollTop
    setScrollActive((current) => (position && position > 120) || false)
  }

  const [activeStep, setActiveStep] = React.useState(0)

  const handleNext = () => setActiveStep((prevActiveStep) => prevActiveStep + 1)

  const handleBack = () => setActiveStep((prevActiveStep) => prevActiveStep - 1)

  const handleReset = () => setActiveStep(0)

  const showStep = (step:number) => step === activeStep ? 'inline' : 'hidden'

  const steps = ['Profile', 'Membership', 'Review']
  return (
    <div className="grad-1">
      <div className="grad-2">
        <div className="grad-3">
          <div className="grad-4">
            <div className="w-full min-h-screen max-h-screen flex flex-col sm:flex-row flex-wrap sm:flex-nowrap flex-grow">
              <main
                role="main"
                className="w-full min-h-screen flex-grow m-0 overflow-auto scrollbar-hide relative"
                onScroll={handleScroll}
                ref={mainRef}
              >
                <Toasts />

                <Section
                  className="box-border snap-y min-h-full"
                  subTitle="Account setup"
                >
                  <div
                    className="
                    mt-4 p-4 
                    bg-neutral-content
                    even:bg-opacity-90 odd:bg-opacity-100
                    rounded-2xl
                    snap-always snap-start
                    "
                  >
                    <Stepper activeStep={activeStep}>
                        {steps.map((label, index) => {
                            return (
                                <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                                </Step>
                            )
                        })}
                    </Stepper>
                        <div className={showStep(0)}>
                            <Box sx={{display: 'inline', pt: 2}}>
                                {/* <div className='bg-gradient-to-r from-accent to-primary w-full p-2 mt-2'>
                                    <h3 className='text-primary-content font-extrabold text-3xl [text-shadow:_0_2px_0_rgb(0_0_0_/_80%)]'>Profile</h3>
                                </div> */}
                                <UserNameAndAvatar />
                            </Box>
                        </div>
                        <div className={showStep(1)}>
                            <Box sx={{display: 'inline', pt: 2}}>
                                {/* <div className='bg-gradient-to-r from-accent to-primary w-full p-2 mt-2'>
                                    <h3 className='text-primary-content font-extrabold text-3xl [text-shadow:_0_2px_0_rgb(0_0_0_/_80%)]'>Billing</h3>
                                </div> */}
                                <UserBillingDetail />
                            </Box>
                        </div>
                        <div className={showStep(2)}>
                          <p className="text-base leading-4 text-base-content text-opacity-70">
                              That's everything!</p>
                          <h1 role="heading" className="md:text-5xl text-3xl font-bold leading-10 mt-3 text-base-content">
                              Welcome to Cyfr!</h1>
                          <p role="contentinfo" className="text-base leading-5 mt-5 text-base-content text-opacity-70">
                              We hope you will find your time with us productive, educational and fun! For real. <br/>
                              <strong>Where to?</strong></p>
                          {cyfrUser &&
                          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                              <ShrinkableLink label='Look at Posts!' className='bg-secondary px-4' href='/' />
                              <Box sx={{ flex: '1 1 auto' }} />
                              <ShrinkableLink label='Create a Gallery!' className='bg-secondary px-4' href={`/user/${cyfrUser.slug}/gallery`} />
                              <Box sx={{ flex: '1 1 auto' }} />
                              <ShrinkableLink label='Start a Book!' className='bg-secondary px-4' href={`/user/${cyfrUser.slug}/books`} />
                          </Box>
                          }
                        </div>

                        <div>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Button
                                color="inherit"
                                disabled={activeStep === 0}
                                onClick={handleBack}
                                sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleNext}>
                                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </Box>
                        </div>
                  </div>
                </Section>
                <Footer />
              </main>
              <div className="w-fixed w-full flex-shrink flex-grow-0 px-2"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SetupPage
