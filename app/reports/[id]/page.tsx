"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, ArrowLeft, FileText, Clock, Building, CheckCircle, AlertCircle, ExternalLink } from "lucide-react"

type ReportDetails = {
  organizationType: string
  organizationName: string
  reportType: string
  reportTitle: string
  reportDetails: string
  timestamp: string
  organizationVerified: boolean
  ipfsHash: string
  blockchainTxHash: string
  status: "pending" | "reviewing" | "resolved"
}

export default function ReportDetail() {
  const { id } = useParams()
  const [report, setReport] = useState<ReportDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<"verifying" | "verified" | "failed">("verifying")

  useEffect(() => {
    // In a real app, this would fetch the report from IPFS and verify it on the blockchain
    // For demo purposes, we'll use mock data
    const fetchReport = async () => {
      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock report data
        const mockReport: ReportDetails = {
          organizationType: "company",
          organizationName: "",
          reportType: "ethics",
          reportTitle: "Unethical Marketing Practices",
          reportDetails:
            "The marketing team has been instructed to make misleading claims about product capabilities. Specifically, they are advertising features that don't exist or are still in development as if they are currently available. This has led to customer complaints and potential legal issues. I have documentation showing the internal communications directing this practice.",
          timestamp: "2023-05-15T10:30:00Z",
          organizationVerified: true,
          ipfsHash: "QmT8CZxmWqzuMnF2CSbrRPKrxChMV3vWG5zMYFGYSKQHd5",
          blockchainTxHash: "0x7b5d8c8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7",
          status: "reviewing",
        }

        setReport(mockReport)
        setLoading(false)

        // Simulate blockchain verification
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setVerificationStatus("verified")
      } catch (error) {
        console.error("Error fetching report:", error)
        setLoading(false)
        setVerificationStatus("failed")
      }
    }

    fetchReport()
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "reviewing":
        return "bg-blue-100 text-blue-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getVerificationStatusIcon = () => {
    switch (verificationStatus) {
      case "verifying":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "verified":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " at " + date.toLocaleTimeString()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Report Not Found</CardTitle>
            <CardDescription>The report you are looking for does not exist or has been removed.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={getStatusColor(report.status)}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </Badge>
            <span className="text-sm text-gray-500">Report ID: {id}</span>
          </div>
          <h1 className="text-3xl font-bold">{report.reportTitle}</h1>
          <div className="flex flex-col sm:flex-row gap-4 mt-2 text-gray-500">
            <div className="flex items-center gap-1">
              <Building className="h-4 w-4" />
              <span>{report.organizationName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Submitted on {formatDate(report.timestamp)}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="mb-4">
                <TabsTrigger value="details">Report Details</TabsTrigger>
                <TabsTrigger value="verification">Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Report Information</CardTitle>
                    <CardDescription>Full details of the whistleblower report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Report Type</h3>
                      <p className="capitalize">{report.reportType}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
                      <p className="whitespace-pre-line">{report.reportDetails}</p>
                    </div>
                    {report.organizationVerified && (
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <p className="text-sm text-green-700">
                          The reporter has been verified as a member of {report.organizationName}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="verification">
                <Card>
                  <CardHeader>
                    <CardTitle>Blockchain Verification</CardTitle>
                    <CardDescription>Verification details for this report</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-2 p-4 bg-gray-50 border rounded-md">
                      {getVerificationStatusIcon()}
                      <div>
                        <p className="font-medium">
                          {verificationStatus === "verifying" && "Verifying report authenticity..."}
                          {verificationStatus === "verified" && "Report verified on blockchain"}
                          {verificationStatus === "failed" && "Verification failed"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {verificationStatus === "verifying" &&
                            "Checking the blockchain for this report's authenticity"}
                          {verificationStatus === "verified" &&
                            "This report has been cryptographically verified on the Ethereum blockchain"}
                          {verificationStatus === "failed" && "Unable to verify this report on the blockchain"}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">IPFS Hash</h3>
                      <div className="flex items-center gap-2">
                        <code className="p-2 bg-gray-100 rounded text-sm font-mono break-all">{report.ipfsHash}</code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a href={`https://ipfs.io/ipfs/${report.ipfsHash}`} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-1">Blockchain Transaction</h3>
                      <div className="flex items-center gap-2">
                        <code className="p-2 bg-gray-100 rounded text-sm font-mono break-all">
                          {report.blockchainTxHash}
                        </code>
                        <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                          <a
                            href={`https://etherscan.io/tx/${report.blockchainTxHash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                      <p className="text-sm text-blue-700">
                        This report is immutably stored on IPFS and verified on the Ethereum blockchain, ensuring its
                        authenticity and preventing tampering.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Organization</CardTitle>
                <CardDescription>Information about the reported organization</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Name</h3>
                  <p>{report.organizationName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Type</h3>
                  <p className="capitalize">{report.organizationType}</p>
                </div>
                <div className="pt-4 border-t">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Actions</h3>
                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <FileText className="mr-2 h-4 w-4" />
                      Download Report
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Shield className="mr-2 h-4 w-4" />
                      Update Status
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
