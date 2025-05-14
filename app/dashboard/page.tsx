"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Shield, Search, FileText, Clock, Building } from "lucide-react"

type Report = {
  id: string
  ipfsHash: string
  organizationType: string
  organizationName: string
  reportType: string
  reportTitle: string
  timestamp: string
  status: "pending" | "reviewing" | "resolved"
}

export default function Dashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would fetch reports from a database or the blockchain
    // For demo purposes, we'll use mock data
    const mockReports: Report[] = [
      {
        id: "1",
        ipfsHash: "QmT8CZxmWqzuMnF2CSbrRPKrxChMV3vWG5zMYFGYSKQHd5",
        organizationType: "company",
        organizationName: "Tech Innovations Inc.",
        reportType: "ethics",
        reportTitle: "Unethical Marketing Practices",
        timestamp: "2023-05-15T10:30:00Z",
        status: "reviewing",
      },
      {
        id: "2",
        ipfsHash: "QmUNLLsPACCz1vLxQVkXqqLX5R1X345qqfHbsf67hvA3Nn",
        organizationType: "school",
        organizationName: "Westfield University",
        reportType: "harassment",
        reportTitle: "Faculty Harassment Case",
        timestamp: "2023-06-02T14:45:00Z",
        status: "pending",
      },
      {
        id: "3",
        ipfsHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
        organizationType: "government",
        organizationName: "Department of Transportation",
        reportType: "financial",
        reportTitle: "Budget Misallocation",
        timestamp: "2023-04-28T09:15:00Z",
        status: "resolved",
      },
    ]

    setTimeout(() => {
      setReports(mockReports)
      setLoading(false)
    }, 1000)
  }, [])

  const filteredReports = reports.filter(
    (report) =>
      report.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "financial":
        return "💰"
      case "harassment":
        return "⚠️"
      case "safety":
        return "🛡️"
      case "ethics":
        return "⚖️"
      default:
        return "📝"
    }
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
              <Link href="/">Home</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/submit">New Report</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Reports Dashboard</h1>
            <p className="text-gray-500">View and manage whistleblower reports</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search reports..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>
              Showing {filteredReports.length} of {reports.length} total reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{getReportTypeIcon(report.reportType)}</span>
                            <span className="capitalize">{report.reportType}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{report.reportTitle}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-gray-500" />
                            {report.organizationName}
                          </div>
                        </TableCell>
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        No reports found matching your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
