"use client";

import { AuthLayout } from "@/components/auth/auth-layout";
import { SignUpHeader } from "@/components/signup/signup-header";
import { SignUpFooter } from "@/components/signup/signup-footer";
import { SignUpProgressBar } from "@/components/signup/signup-progress-bar";
import { Step1AccountForm } from "@/components/signup/step1-account-form";
import { Step2OtpForm } from "@/components/signup/step2-otp-form";
import { Step3PersonalInfoForm } from "@/components/signup/step3-personal-info-form";
import { useSignUp } from "@/hooks/auth/use-sign-up";

export default function SignUpPage() {
    const {
        individualStep,
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        otpCode,
        resendTimer,
        otpInputRefs,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        gender,
        setGender,
        birthdate,
        setBirthdate,
        isLoading,
        error,
        handleStep1Submit,
        handleStep2Submit,
        handleStep3Submit,
        handleOtpChange,
        handleOtpKeyDown,
        handleOtpPaste,
        handleResendOtp,
    } = useSignUp();

    return (
        <AuthLayout>
            <SignUpHeader currentStep={individualStep} />
            <SignUpProgressBar currentStep={individualStep} />

            {individualStep === 1 && (
                <Step1AccountForm
                    email={email}
                    password={password}
                    confirmPassword={confirmPassword}
                    showPassword={showPassword}
                    showConfirmPassword={showConfirmPassword}
                    error={error}
                    isLoading={isLoading}
                    onEmailChange={setEmail}
                    onPasswordChange={setPassword}
                    onConfirmPasswordChange={setConfirmPassword}
                    onToggleShowPassword={() => setShowPassword(!showPassword)}
                    onToggleShowConfirmPassword={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                    }
                    onSubmit={handleStep1Submit}
                />
            )}

            {individualStep === 2 && (
                <Step2OtpForm
                    email={email}
                    otpCode={otpCode}
                    resendTimer={resendTimer}
                    error={error}
                    isLoading={isLoading}
                    otpInputRefs={otpInputRefs}
                    onOtpChange={handleOtpChange}
                    onOtpKeyDown={handleOtpKeyDown}
                    onOtpPaste={handleOtpPaste}
                    onResendOtp={handleResendOtp}
                    onSubmit={handleStep2Submit}
                />
            )}

            {individualStep === 3 && (
                <Step3PersonalInfoForm
                    firstName={firstName}
                    lastName={lastName}
                    gender={gender}
                    birthdate={birthdate}
                    error={error}
                    isLoading={isLoading}
                    onFirstNameChange={setFirstName}
                    onLastNameChange={setLastName}
                    onGenderChange={setGender}
                    onBirthdateChange={setBirthdate}
                    onSubmit={handleStep3Submit}
                />
            )}

            <SignUpFooter />
        </AuthLayout>
    );
}
