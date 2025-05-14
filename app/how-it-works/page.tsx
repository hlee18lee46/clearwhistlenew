import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Lock, Building, FileText, Database } from "lucide-react"

export default function HowItWorks() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/home" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Login</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-800"
            >
              <Link href="/admin/login">Admin</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/submit">Submit Report</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <div className="container max-w-6xl mx-auto py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">How ClearWhistle Works</h1>
            <p className="text-lg text-gray-600 mb-12">
              ClearWhistle uses blockchain technology to provide secure, anonymous whistleblowing while verifying
              organizational affiliation.
            </p>

            <div className="space-y-16">
              <section className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Lock className="h-16 w-16 text-emerald-600" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Anonymous Reporting</h2>
                  <p className="text-gray-600 mb-4">
                    ClearWhistle allows you to submit reports without revealing your identity. We use advanced
                    cryptographic techniques to ensure your anonymity is preserved throughout the process.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>No personal identifiers are stored with your report</li>
                    <li>All connections are encrypted end-to-end</li>
                    <li>IP addresses are not logged or stored</li>
                    <li>Browser fingerprinting protection is enabled</li>
                  </ul>
                </div>
              </section>

              <section className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center md:order-last">
                  <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Building className="h-16 w-16 text-emerald-600" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Organizational Verification</h2>
                  <p className="text-gray-600 mb-4">
                    While keeping your identity anonymous, we verify that you belong to the organization you're
                    reporting about. This adds credibility to your report without compromising your anonymity.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Email domain verification confirms organizational affiliation</li>
                    <li>One-time verification codes sent to organizational email</li>
                    <li>Email addresses are never stored with reports</li>
                    <li>Zero-knowledge proofs verify membership without revealing identity</li>
                  </ul>
                </div>
              </section>

              <section className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center">
                  <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center">
                    <Database className="h-16 w-16 text-emerald-600" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Blockchain Storage with Pinata</h2>
                  <p className="text-gray-600 mb-4">
                    Your report is securely stored on the InterPlanetary File System (IPFS) via Pinata, a decentralized
                    storage solution. This ensures your report cannot be altered or deleted.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Reports are encrypted before being stored on IPFS</li>
                    <li>Content addressing ensures data integrity</li>
                    <li>Distributed storage prevents single points of failure</li>
                    <li>Pinata ensures your report remains accessible</li>
                  </ul>
                </div>
              </section>

              <section className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-full md:w-1/3 flex justify-center md:order-last">
                  <div className="h-32 w-32 rounded-full bg-emerald-100 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-emerald-600" />
                  </div>
                </div>
                <div className="w-full md:w-2/3">
                  <h2 className="text-2xl font-bold mb-4">Ethereum Blockchain Verification</h2>
                  <p className="text-gray-600 mb-4">
                    A reference to your report is stored on the Ethereum blockchain, creating an immutable timestamp and
                    verification mechanism that proves the report existed at a specific time and hasn't been modified.
                  </p>
                  <ul className="list-disc pl-5 space-y-2 text-gray-600">
                    <li>Smart contracts manage report verification</li>
                    <li>Cryptographic hashes link reports to blockchain entries</li>
                    <li>Tamper-proof record of submission time and content</li>
                    <li>Public verification without revealing report contents</li>
                  </ul>
                </div>
              </section>
            </div>

            <div className="mt-16 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h2 className="text-2xl font-bold mb-4 text-emerald-800">Ready to Submit a Report?</h2>
              <p className="text-emerald-700 mb-6">
                Your voice matters. Submit a whistleblower report securely and anonymously while maintaining
                credibility.
              </p>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/apply">apply</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t py-6 bg-gray-50">
        <div className="container max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Shield className="h-5 w-5 text-emerald-600" />
            <span className="font-semibold">ClearWhistle</span>
          </div>
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ClearWhistle. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
