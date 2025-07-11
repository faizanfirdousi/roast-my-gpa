"use client"



import { useState } from "react"
import { Upload, FileText, Flame, Moon, Sun, Loader2 } from "lucide-react"

export default function RoastMyGPA() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [roastMessage, setRoastMessage] = useState("")
  const [error, setError] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isDragOver, setIsDragOver] = useState(false)

  const formatRoastMessage = (text) => {
    if (!text) return { __html: '' };
    const boldedText = text.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
    return { __html: boldedText };
  };

  const handleFileSelect = (file) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.")
      setSelectedFile(null)
      return
    }

    setSelectedFile(file)
    setError("")
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRoastMe = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("transcript", selectedFile)

      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()
      setRoastMessage(
        data.roast || "Your academic performance speaks for itself... and it's not saying anything good! 🔥",
      )
    } catch (err) {
      setError("Something went wrong. Try again.")
      console.error("Upload error:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode
          ? "bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white"
          : "bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 text-gray-900"
      }`}
    >
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className={`p-3 rounded-full transition-all duration-300 ${
            isDarkMode
              ? "bg-yellow-400 text-gray-900 hover:bg-yellow-300"
              : "bg-gray-800 text-yellow-400 hover:bg-gray-700"
          }`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1
            className={`text-5xl md:text-7xl font-black mb-4 ${
              isDarkMode
                ? "bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent"
                : "bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent"
            }`}
          >
            Roast My GPA 🔥
          </h1>
          <p className={`text-xl md:text-2xl font-medium ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
            Upload your result PDF and get roasted based on your grades
          </p>
          <p className={`text-sm mt-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Warning: Prepare for brutal honesty 💀
          </p>
        </div>

        {/* File Upload Section */}
        <div
          className={`rounded-2xl p-8 mb-8 border-2 border-dashed transition-all duration-300 ${
            isDragOver
              ? isDarkMode
                ? "border-orange-400 bg-orange-900/20"
                : "border-orange-500 bg-orange-100"
              : isDarkMode
                ? "border-gray-600 bg-gray-800/50"
                : "border-gray-300 bg-white/70"
          } backdrop-blur-sm`}
        >
          <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className="text-center">
            <div
              className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                isDarkMode ? "bg-red-900/50" : "bg-red-100"
              }`}
            >
              <Upload className={`w-8 h-8 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
            </div>

            <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Upload your result PDF
            </h3>

            <p className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
              Drag and drop your PDF here, or click to browse
            </p>

            <input type="file" accept=".pdf" onChange={handleFileInputChange} className="hidden" id="file-upload" />

            <label
              htmlFor="file-upload"
              className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold cursor-pointer transition-all duration-300 ${
                isDarkMode
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              } hover:scale-105 shadow-lg`}
            >
              <FileText className="w-5 h-5 mr-2" />
              Choose PDF File
            </label>

            {selectedFile && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isDarkMode ? "bg-green-900/30 border border-green-700" : "bg-green-50 border border-green-200"
                }`}
              >
                <p className={`font-medium ${isDarkMode ? "text-green-400" : "text-green-700"}`}>
                  ✅ Selected: {selectedFile.name}
                </p>
                <p className={`text-sm ${isDarkMode ? "text-green-300" : "text-green-600"}`}>
                  Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            )}

            {error && (
              <div
                className={`mt-4 p-4 rounded-lg ${
                  isDarkMode ? "bg-red-900/30 border border-red-700" : "bg-red-50 border border-red-200"
                }`}
              >
                <p className={`font-medium ${isDarkMode ? "text-red-400" : "text-red-700"}`}>❌ {error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Roast Me Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleRoastMe}
            disabled={!selectedFile || isLoading}
            className={`inline-flex items-center px-8 py-4 text-xl font-bold rounded-xl transition-all duration-300 ${
              !selectedFile || isLoading
                ? isDarkMode
                  ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isDarkMode
                  ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white hover:scale-105 shadow-lg hover:shadow-xl"
                  : "bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white hover:scale-105 shadow-lg hover:shadow-xl"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 mr-2 animate-spin" />
                Preparing Your Roast...
              </>
            ) : (
              <>
                <Flame className="w-6 h-6 mr-2" />
                Roast Me
              </>
            )}
          </button>
        </div>

        {/* Roast Output Section */}
        <div
          className={`rounded-2xl p-8 ${isDarkMode ? "bg-gray-800/50" : "bg-white/70"} backdrop-blur-sm border ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          } shadow-xl`}
        >
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                isDarkMode ? "bg-red-900/50" : "bg-red-100"
              }`}
            >
              <Flame className={`w-6 h-6 ${isDarkMode ? "text-red-400" : "text-red-600"}`} />
            </div>

            <div className="flex-1">
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-900"}`}>Your Roast</h3>

              <div
                className={`p-6 rounded-xl ${isDarkMode ? "bg-gray-900/50" : "bg-gray-50"} border-l-4 ${
                  roastMessage
                    ? isDarkMode
                      ? "border-red-400"
                      : "border-red-500"
                    : isDarkMode
                      ? "border-gray-600"
                      : "border-gray-300"
                }`}
              >
                {roastMessage ? (
                  <p
                    className={`text-lg leading-relaxed animate-fade-in ${
                      isDarkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                    dangerouslySetInnerHTML={formatRoastMessage(roastMessage)}
                  />
                ) : (
                  <p className={`text-lg italic ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                    Your roast will appear here... 🔥
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className={`text-lg ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
            Created by Faizan Firdousi with lots of love
          </p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href="https://github.com/faizanfirdousi" target="_blank" rel="noopener noreferrer" className={`${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
              </svg>
            </a>
            <a href="https://x.com/codoyevskyy" target="_blank" rel="noopener noreferrer" className={`${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-black"}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}
