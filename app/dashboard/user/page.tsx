"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, FileText, Clock, AlertCircle } from "lucide-react"

type UserReport = {
  id: string
  reportTitle: string
  reportType: string
  timestamp: string
  status: "pending" | "reviewing" | "resolved"
}

export default function UserDashboard() {
  const [reports, setReports] = useState<UserReport[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState({ name: "John Doe", email: "john.doe@example.com" })

  useEffect(() => {
    // Simulate loading user reports
    setTimeout(() => {
      setReports([
        {
          id: "1",
          reportTitle: "Unethical Marketing Practices",
          reportType: "ethics",
          timestamp: "2023-05-15T10:30:00Z",
          status: "reviewing",
        },
        {
          id: "2",
          reportTitle: "Workplace Harassment Incident",
          reportType: "harassment",
          timestamp: "2023-06-02T14:45:00Z",
          status: "pending",
        },
      ])
      setLoading(false)
    }, 1000)
  }, [])

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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </div>
          <nav className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Welcome, {user.name}</span>
            <Button asChild variant="outline" size="sm">
              <Link href="/home">Logout</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            <p className="text-gray-500">Track the status of your whistleblower reports</p>
          </div>
          <Button asChild>
            <Link href="/submit">Submit New Report</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">{reports.length}</CardTitle>
              <CardDescription>Total Reports</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-blue-600">
                {reports.filter((r) => r.status === "reviewing").length}
              </CardTitle>
              <CardDescription>Under Review</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl text-green-600">
                {reports.filter((r) => r.status === "resolved").length}
              </CardTitle>
              <CardDescription>Resolved</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Reports</CardTitle>
            <CardDescription>Track the status of reports you've submitted</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : reports.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Title</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.reportTitle}</TableCell>
                      <TableCell className="capitalize">{report.reportType}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          {new Date(report.timestamp).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/reports/${report.id}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Reports Yet</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  You haven't submitted any whistleblower reports yet. Your reports will appear here once submitted.
                </p>
                <Button asChild>
                  <Link href="/submit">Submit Your First Report</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
