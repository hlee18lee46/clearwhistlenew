"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowLeft, Upload, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { uploadToIPFS } from "@/lib/pinata"
import { verifyOrganizationalEmail } from "@/lib/verification"
import { storeOnBlockchain } from "@/lib/blockchain"

export default function SubmitReport() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    organizationType: "",
    organizationName: "",
    organizationEmail: "",
    reportType: "",
    reportTitle: "",
    reportDetails: "",
    evidence: null as File | null,
  })
  const [verificationCode, setVerificationCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [reportHash, setReportHash] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, evidence: e.target.files![0] }))
    }
  }

  const handleVerifyEmail = async () => {
    setLoading(true)
    setError("")
    try {
      // In a real app, this would send a verification code to the email
      // For demo purposes, we'll simulate this
      await verifyOrganizationalEmail(formData.organizationEmail)
      setStep(2)
    } catch (err) {
      setError("Failed to send verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    setLoading(true)
    setError("")
    try {
      // In a real app, this would verify the code
      // For demo purposes, we'll simulate this
      if (verificationCode === "123456") {
        // Demo code
        setIsVerified(true)
        setStep(3)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (err) {
      setError("Failed to verify code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitReport = async () => {
    setLoading(true)
    setError("")
    try {
      // Upload report to IPFS via Pinata
      const ipfsHash = await uploadToIPFS({
        ...formData,
        timestamp: new Date().toISOString(),
        organizationVerified: isVerified,
      })

      // Store the IPFS hash on Ethereum blockchain
      const txHash = await storeOnBlockchain(ipfsHash)

      setReportHash(ipfsHash)
      setStep(4)
    } catch (err) {
      setError("Failed to submit report. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/home" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit a Whistleblower Report</CardTitle>
            <CardDescription>
              Your identity will remain anonymous while we verify your organizational affiliation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationType">Organization Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("organizationType", value)}
                    value={formData.organizationType}
                  >
                    <SelectTrigger id="organizationType">
                      <SelectValue placeholder="Select organization type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="company">Company</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                      <SelectItem value="nonprofit">Non-profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationName">Organization Name</Label>
                  <Input
                    id="organizationName"
                    name="organizationName"
                    value={formData.organizationName}
                    onChange={handleChange}
                    placeholder="Enter the name of your organization"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizationEmail">Your Organizational Email</Label>
                  <Input
                    id="organizationEmail"
                    name="organizationEmail"
                    type="email"
                    value={formData.organizationEmail}
                    onChange={handleChange}
                    placeholder="your.name@organization.com"
                  />
                  <p className="text-sm text-gray-500">
                    We'll verify you belong to this organization without storing your email.
                  </p>
                </div>

                <Button
                  onClick={handleVerifyEmail}
                  disabled={
                    loading || !formData.organizationEmail || !formData.organizationName || !formData.organizationType
                  }
                  className="w-full"
                >
                  {loading ? "Sending..." : "Verify Email"}
                </Button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="verificationCode">Verification Code</Label>
                  <Input
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code sent to your email"
                  />
                  <p className="text-sm text-gray-500">
                    Enter the verification code sent to {formData.organizationEmail}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(1)} disabled={loading}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleVerifyCode}
                    disabled={loading || verificationCode.length !== 6}
                    className="flex-1"
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select
                    onValueChange={(value) => handleSelectChange("reportType", value)}
                    value={formData.reportType}
                  >
                    <SelectTrigger id="reportType">
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="financial">Financial Misconduct</SelectItem>
                      <SelectItem value="harassment">Harassment or Discrimination</SelectItem>
                      <SelectItem value="safety">Safety Violations</SelectItem>
                      <SelectItem value="ethics">Ethical Violations</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportTitle">Report Title</Label>
                  <Input
                    id="reportTitle"
                    name="reportTitle"
                    value={formData.reportTitle}
                    onChange={handleChange}
                    placeholder="Brief title describing the issue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportDetails">Report Details</Label>
                  <Textarea
                    id="reportDetails"
                    name="reportDetails"
                    value={formData.reportDetails}
                    onChange={handleChange}
                    placeholder="Provide detailed information about the incident or issue"
                    rows={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="evidence">Evidence (Optional)</Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="evidence"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PDF, PNG, JPG or MP4 (MAX. 10MB)</p>
                      </div>
                      <input id="evidence" type="file" className="hidden" onChange={handleFileChange} />
                    </label>
                  </div>
                  {formData.evidence && (
                    <p className="text-sm text-gray-500">File selected: {formData.evidence.name}</p>
                  )}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setStep(2)} disabled={loading}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitReport}
                    disabled={loading || !formData.reportType || !formData.reportTitle || !formData.reportDetails}
                    className="flex-1"
                  >
                    {loading ? "Submitting..." : "Submit Report"}
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold">Report Submitted Successfully</h3>
                <p>
                  Your report has been securely stored on the blockchain. Please save your report reference number for
                  future inquiries.
                </p>
                <div className="p-4 bg-gray-100 rounded-md">
                  <p className="font-mono text-sm break-all">{reportHash}</p>
                </div>
                <p className="text-sm text-gray-500">
                  This hash is your proof of submission and can be used to verify the authenticity of your report.
                </p>
              </div>
            )}
          </CardContent>
          {step === 4 && (
            <CardFooter>
              <Button onClick={() => router.push("/home")} className="w-full">
                Return to Home
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}
