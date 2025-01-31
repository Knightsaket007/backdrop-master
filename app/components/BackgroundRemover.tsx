// 'use client'

// import { useState, useCallback } from 'react'
// import { Button } from "@/components/ui/button"
// // Make sure you adjust this import based on the correct export in the updated package
// import ImglyBackground from '@imgly/background-removal'  // Adjusted to default export

// export default function BackgroundRemover() {
//   const [originalImage, setOriginalImage] = useState<string | null>(null)
//   const [processedImage, setProcessedImage] = useState<string | null>(null)
//   const [isProcessing, setIsProcessing] = useState(false)

//   const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       const reader = new FileReader()
//       reader.onload = (e) => {
//         setOriginalImage(e.target?.result as string)
//         setProcessedImage(null)
//       }
//       reader.readAsDataURL(file)
//     }
//   }, [])

//   const handleRemoveBackground = useCallback(async () => {
//     if (originalImage) {
//       setIsProcessing(true)
//       try {
//         const blob = await fetch(originalImage).then(r => r.blob())
        
//         // Assuming `ImglyBackground` is the correct method to call (adjust accordingly)
//         const processedBlob = await ImglyBackground(blob)

//         // Create a URL from the processed Blob and set it as processed image
//         const processedUrl = URL.createObjectURL(processedBlob)
//         setProcessedImage(processedUrl)
//       } catch (error) {
//         console.error('Error removing background:', error)
//         alert('An error occurred while removing the background. Please try again.')
//       } finally {
//         setIsProcessing(false)
//       }
//     }
//   }, [originalImage])

//   return (
//     <div className="flex flex-col items-center gap-4">
//       <div className="flex gap-4">
//         <Button asChild>
//           <label>
//             Upload Image
//             <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
//           </label>
//         </Button>
//         <Button onClick={handleRemoveBackground} disabled={!originalImage || isProcessing}>
//           {isProcessing ? 'Processing...' : 'Remove Background'}
//         </Button>
//       </div>
//       <div className="flex gap-4 mt-4">
//         {originalImage && (
//           <div className="relative w-64 h-64">
//             <img src={originalImage} alt="Original" className="object-contain w-full h-full" />
//           </div>
//         )}
//         {processedImage && (
//           <div className="relative w-64 h-64">
//             <img src={processedImage} alt="Processed" className="object-contain w-full h-full" />
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }
