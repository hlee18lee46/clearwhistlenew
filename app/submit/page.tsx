"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shield } from "lucide-react"
import { useEffect } from "react"



export default function SubmitReport() {
  const router = useRouter()
  const [reportText, setReportText] = useState("")
  const [loading, setLoading] = useState(false)
  const [ipfsHash, setIpfsHash] = useState("")
  const [error, setError] = useState("")

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")
  setIpfsHash("")

  try {
    // Step 1: Upload to Pinata via /submit
    const res = await fetch("http://127.0.0.1:5000/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ report_text: reportText }),
    })

    const data = await res.json()
    if (!res.ok) throw new Error(data.error || "Failed to submit report")

    const ipfsHash = data.ipfs_hash
    setIpfsHash(ipfsHash)

    // Step 2: Save hash to MongoDB via /store-hash
    const saveRes = await fetch("http://127.0.0.1:5000/store-hash", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ipfs_hash: ipfsHash }),
    })

    const saveData = await saveRes.json()
    if (!saveRes.ok) throw new Error(saveData.error || "Failed to store hash")

    setReportText("")
  } catch (err: any) {
    setError(err.message)
  } finally {
    setLoading(false)
  }
}


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex items-center mb-8">
          <Link href="/home" className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Submit Anonymous Report</CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="report">Report Text</Label>
                <Textarea
                  id="report"
                  placeholder="Type your report here..."
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  rows={8}
                  required
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Submit Report"}
              </Button>
            </form>

            {ipfsHash && (
              <div className="mt-6 text-green-600 text-sm">
                ✅ Report submitted. IPFS Hash:{" "}
                <code className="break-all font-mono">{ipfsHash}</code>
              </div>
            )}

            {error && (
              <div className="mt-6 text-red-500 text-sm">
                ⚠️ Error: {error}
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => router.push("/home")}>
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
