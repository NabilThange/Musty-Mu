import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white font-mono flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="bg-yellow-500 border-8 border-black p-12 shadow-brutal">
          <div className="text-8xl font-black mb-6">404</div>
          <h1 className="text-4xl font-black mb-4 uppercase">PAGE NOT FOUND</h1>
          <p className="text-xl font-bold mb-8">
            Looks like you've wandered into uncharted territory. Let's get you back to studying!
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button className="bg-blue-600 text-white border-4 border-black font-bold">
                <Home className="h-5 w-5 mr-2" />
                GO TO DASHBOARD
              </Button>
            </Link>
            <Link href="/syllabus">
              <Button className="bg-red-600 text-white border-4 border-black font-bold">
                <Search className="h-5 w-5 mr-2" />
                BROWSE SYLLABUS
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-8 bg-white border-4 border-dashed border-black p-6">
          <h2 className="text-xl font-black mb-4">QUICK LINKS</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/ai-assistant" className="font-bold hover:underline">
              🤖 AI Assistant
            </Link>
            <Link href="/resources" className="font-bold hover:underline">
              📚 Resources
            </Link>
            <Link href="/syllabus" className="font-bold hover:underline">
              📄 Syllabus
            </Link>
            <Link href="/landing" className="font-bold hover:underline">
              🏠 Landing
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
