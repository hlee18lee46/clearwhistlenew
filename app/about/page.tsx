import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, Users, Globe, LightbulbIcon } from "lucide-react"

export default function About() {
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
            <Link href="/how-it-works" className="text-sm font-medium hover:underline">
              How It Works
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
            <h1 className="text-4xl font-bold mb-6">About ClearWhistle</h1>
            <p className="text-lg text-gray-600 mb-12">
              ClearWhistle was founded with a simple mission: to create a safe space for truth-tellers while ensuring
              accountability.
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                We believe that transparency and accountability are essential for healthy organizations and societies.
                However, those who speak up often face retaliation or dismissal. ClearWhistle provides a secure platform
                where whistleblowers can report misconduct without fear, while organizations can receive credible
                information to address issues.
              </p>
              <p className="text-gray-600">
                By leveraging blockchain technology, we've created a system that protects anonymity while verifying
                organizational affiliation, striking the perfect balance between credibility and protection.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Values</h2>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Shield className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Security & Privacy</h3>
                  <p className="text-gray-600">
                    We prioritize the security and privacy of whistleblowers above all else, implementing the strongest
                    protections available.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Accountability</h3>
                  <p className="text-gray-600">
                    We believe in holding organizations accountable through verified, credible reporting mechanisms.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <Globe className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Transparency</h3>
                  <p className="text-gray-600">
                    We operate with complete transparency about our processes, technology, and handling of reports.
                  </p>
                </div>
                <div className="p-6 bg-white rounded-lg border shadow-sm">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                    <LightbulbIcon className="h-6 w-6 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Innovation</h3>
                  <p className="text-gray-600">
                    We continuously innovate to provide the most secure, effective whistleblowing platform possible.
                  </p>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4">Our Technology</h2>
              <p className="text-gray-600 mb-4">
                ClearWhistle combines several cutting-edge technologies to provide a secure, anonymous, and verifiable
                whistleblowing platform:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600">
                <li>
                  <strong>Blockchain Verification:</strong> We use Ethereum smart contracts to create immutable records
                  of reports.
                </li>
                <li>
                  <strong>IPFS Storage via Pinata:</strong> Reports are stored on the decentralized InterPlanetary File
                  System, ensuring they cannot be altered or deleted.
                </li>
                <li>
                  <strong>Zero-Knowledge Proofs:</strong> We verify organizational affiliation without revealing the
                  whistleblower's identity.
                </li>
                <li>
                  <strong>End-to-End Encryption:</strong> All communications and data are encrypted to protect privacy.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Our Team</h2>
              <p className="text-gray-600 mb-6">
                ClearWhistle was founded by a team of cybersecurity experts, blockchain developers, and ethics advocates
                committed to creating a safer environment for truth-tellers.
              </p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-bold">Alex Chen</h3>
                  <p className="text-sm text-gray-500">Founder & CEO</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-bold">Maya Johnson</h3>
                  <p className="text-sm text-gray-500">CTO & Blockchain Lead</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
                  <h3 className="font-bold">David Park</h3>
                  <p className="text-sm text-gray-500">Head of Security</p>
                </div>
              </div>
            </section>

            <div className="mt-16 p-6 bg-emerald-50 rounded-lg border border-emerald-200">
              <h2 className="text-2xl font-bold mb-4 text-emerald-800">Join Our Mission</h2>
              <p className="text-emerald-700 mb-6">
                Whether you're a whistleblower seeking protection or an organization committed to ethical practices,
                ClearWhistle provides the tools you need.
              </p>
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/apply">Apply</Link>
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
