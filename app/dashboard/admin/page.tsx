"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Shield, Search, FileText, Clock, Filter, LogOut } from "lucide-react"

type Report = {
  id: string
  ipfsHash: string
  reportType: string
  reportTitle: string
  timestamp: string
  status: "pending" | "reviewing" | "resolved"
}

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([])
  const [filteredReports, setFilteredReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [admin, setAdmin] = useState({
    name: "Admin User",
    email: "admin@techinnovations.com",
    organization: "",
  })

useEffect(() => {
  const fetchReports = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/admin/reports") // <- your backend route
      const data = await res.json()

      const enrichedReports: Report[] = await Promise.all(
        data.map(async (r: any) => {
          try {
            const ipfsRes = await fetch(`https://gateway.pinata.cloud/ipfs/${r.content}`)
            const ipfsData = await ipfsRes.json()
            return {
              id: r._id,
              ipfsHash: r.content,
              reportType: ipfsData.type || "other",
              reportTitle: ipfsData.title || "Untitled Report",
              timestamp: r.timestamp,
              status: "pending", // Default status for now
            }
          } catch {
            return {
              id: r._id,
              ipfsHash: r.content,
              reportType: "other",
              reportTitle: "⚠️ Failed to load",
              timestamp: r.timestamp,
              status: "pending",
            }
          }
        })
      )

      setReports(enrichedReports)
      setFilteredReports(enrichedReports)
      setLoading(false)
    } catch (err) {
      console.error("Failed to fetch reports", err)
      setLoading(false)
    }
  }

  fetchReports()
}, [])


  useEffect(() => {
    // Filter reports based on search query and status filter
    let filtered = reports

    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.reportType.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter)
    }

    setFilteredReports(filtered)
  }, [searchQuery, statusFilter, reports])

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

  const pendingReports = reports.filter((r) => r.status === "pending")
  const reviewingReports = reports.filter((r) => r.status === "reviewing")
  const resolvedReports = reports.filter((r) => r.status === "resolved")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <span className="text-sm text-gray-500 mr-2">{admin.organization}</span>
              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                Admin
              </Badge>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/home">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-500">Manage whistleblower reports for {admin.organization}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">

        </div>

        <Card>
          <CardHeader>
            <CardTitle>Whistleblower Reports</CardTitle>
            <CardDescription>Manage and respond to reports submitted to your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search reports..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reports</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewing">Reviewing</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="pending">
              <TabsList className="mb-4">
                <TabsTrigger value="pending" className="relative">
                  Pending
                  {pendingReports.length > 0 && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full">
                      {pendingReports.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">All Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="pending">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : pendingReports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingReports.map((report) => (
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
                            <div className="flex justify-end gap-2">
<Button variant="outline" size="sm" asChild>
  <a
    href={`https://gateway.pinata.cloud/ipfs/${report.ipfsHash}`}
    target="_blank"
    rel="noopener noreferrer"
    download
  >
    <FileText className="mr-2 h-4 w-4" />
    Download
  </a>
</Button>

                              <Button size="sm">Start Review</Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                      <Shield className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Pending Reports</h3>
                    <p className="text-gray-500 max-w-md">
                      There are currently no pending reports that require your attention.
                    </p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="all">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                  </div>
                ) : filteredReports.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredReports.map((report) => (
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
                              <Link href={`/admin/reports/${report.id}`}>
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
                    <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                      <Search className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No Reports Found</h3>
                    <p className="text-gray-500 max-w-md">
                      No reports match your current search criteria. Try adjusting your filters.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
