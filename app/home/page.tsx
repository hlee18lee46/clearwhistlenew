import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Shield, FileText, Building, Lock } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">ClearWhistle</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
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
              <Link href="/apply">Apply</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 py-20">
          <div className="container max-w-6xl mx-auto text-center px-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Speak Truth <span className="text-emerald-600">Without Fear</span>
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
              Anonymous whistleblowing with organizational verification. Your identity stays hidden while your voice is
              heard.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/apply">Apply</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/how-it-works">Learn How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How ClearWhistle Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Anonymous Reporting</h3>
              <p className="text-gray-600">
                Submit reports without revealing your identity. Your personal information is never stored.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <Building className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Organizational Verification</h3>
              <p className="text-gray-600">We verify you belong to the organization without exposing who you are.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg border bg-white shadow-sm">
              <div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Blockchain Storage</h3>
              <p className="text-gray-600">
                Reports are stored on IPFS via Pinata and verified on Ethereum blockchain for immutability.
              </p>
            </div>
          </div>
        </section>
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
