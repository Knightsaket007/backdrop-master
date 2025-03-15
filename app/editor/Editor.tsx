'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { GiphyFetch } from '@giphy/js-fetch-api';
import { Grid } from '@giphy/react-components';
import {
  Type,
  Palette,
  ImagePlus,
  Undo,
  Redo,
  Download,
  Crop,
  Wand2,
  SlidersHorizontal,
  Brush,
  Eraser,
  Shapes,
  Layers,
  PanelLeftClose,
  PanelRightClose,
  Sparkles,
  Image as ImageIcon,
  Sticker,
  Filter,
  X,
  Check,
  Plus,
  Trash2,
} from 'lucide-react';
import { removeBg } from '../utils/removeBg';
import LoaderComp from '../components/LoaderComp.';
import Image from 'next/image';
import FontSelector from '../components/Fonts';
import fonts from '@/app/font/font.json';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

type Tool = 'brush' | 'eraser' | 'text' | 'sticker' | 'crop' | 'none';
type Sticker = { id: number; src: string; x: number; y: number; };

// Initialize GIPHY API
const giphykey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
const gf = new GiphyFetch(giphykey as string);

function Editor() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool>('none');
  const [showStickers, setShowStickers] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [bgremovedImage, setBgremovedImage] = useState<string | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  // const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [draggedSticker, setDraggedSticker] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLoader, setactiveLoader] = useState(false);
  const [isDraggable, setIsDraggable] = useState(true);
  // const [imgWidth, setImgWidth] = useState(true);
  // const [imgHeight, setImgHeight] = useState(true);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [brushColor, setBrushColor] = useState("rgb(79 70 229)");
  const [brushSize, setBrushSize] = useState(1);
  const [showText, setshowText] = useState(false)

  const [selectedColor, setSelectedColor] = useState('#000000');


  // const [text, setText] = useState("Your Text Here");
  const [texts, setTexts] = useState<{ id: number; content: string; fontFamily: string; size: string; bold: boolean; italic: boolean, color:string }[]>([
    { id: Date.now(), content: "Design Your Words, Define Your World.", fontFamily: "'Zeyada', serif", size: 'clamp(12px, 3vw, 100px)', bold: false, italic: false, color:'#000000' },
  ]);
  const [activeTextId, setActiveTextId] = useState<number>(texts[0].id);


  // const [selectedFont, setSelectedFont] = useState(fonts[0].value); 
  const [selectedFont, setSelectedFont] = useState(texts[0]?.fontFamily || fonts[0].value);
  const isPremiumUser = false;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [aspect, setAspect] = useState(1);

  const [croppingModeOn, setCroppingModeOn] = useState(false)



  useEffect(() => {
    const activeText = texts.find((text) => text.id === activeTextId);
    if (activeText) {
      setSelectedFont(activeText.fontFamily);
    }
  }, [activeTextId, texts]);



  // -=-=-=-=For text-=-=-=-//
  // -=-=-=-=For text-=-=-=-//
  const addText = () => {
    if (texts.length < 4) {
      const newText = { id: Date.now(), content: "New Text", fontFamily: 'Inter, sans-serif', size: 'clamp(12px, 3vw, 100px)",', bold: false, italic: false };
      setTexts([...texts, newText]);
      setActiveTextId(newText.id);
    } else {
      // alert("Max 10 text layers allowed!");
      toast("Maximum 4 text layers allowed!", {
        description: 'Subscribe for more layers'
      })
    }
  };

  const updateText = (id: number, newContent: string) => {
    setTexts((prev) =>
      prev.map((text) => (text.id === id ? { ...text, content: newContent } : text))
    );
  };

  const setActive = (id: number) => {
    setActiveTextId(id);
    console.log('active text...', activeTextId)
  };


  const deleteText = (id: number) => {
    console.log('llll090..', texts.length)
    if (texts.length === 1) {
      toast('minimum one layer should be there')
      return;
    }
    setTexts((prev) => prev.filter((text) => text.id !== id));

    if (activeTextId === id) {
      setActiveTextId(texts.length > 1 ? texts[0].id : 0);
    }
  };





  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.lineCap = 'round';
        context.strokeStyle = 'black';
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
  }, []);

  console.log("Selected Font:", selectedFont); // Debugging

  const resetCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        canvas.width = imgWidth;
        canvas.height = imgHeight;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = brushColor;
        ctx.lineWidth = brushSize;

        contextRef.current = ctx;
      }
    }
  };



  useEffect(() => {
    if (!isCropping) {
      resetCanvas(); // Crop apply/cancel hone pe canvas refresh
    }
  }, [isCropping, imgWidth, imgHeight, brushColor, brushSize]);

  // Handle tool selection
  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    if (tool === 'sticker') {
      setShowStickers(!showStickers);
      setshowText(false);

    } else if (tool === 'crop' && backgroundImage && !bgremovedImage) {
      setIsCropping(true);
      // setRightSidebarOpen(false);
      setCroppingModeOn(true)
    }
    else if (tool === 'text') {
      setshowText(!showText);
      setShowStickers(false);
    }
    else {
      setShowStickers(false);
    }
  };

  // Handle sticker movement
  const handleStickerMouseDown = (e: React.MouseEvent, id: number) => {
    if (selectedTool !== 'none') return;
    setDraggedSticker(id);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggedSticker === null) return;

    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left - 32; // Half of sticker width
    const y = e.clientY - container.top - 32; // Half of sticker height

    setStickers(prev => prev.map(sticker =>
      sticker.id === draggedSticker
        ? { ...sticker, x, y }
        : sticker
    ));
  };

  const handleMouseUp = () => {
    setDraggedSticker(null);
  };

  // Handle sticker selection from GIPHY
  const handleGiphySelect = (gif: any) => {
    setStickers(prev => [...prev, {
      id: Date.now(),
      src: gif.images.fixed_height.url,
      x: Math.random() * 300,
      y: Math.random() * 300
    }]);
    setShowStickers(false);
  };

  // Handle drawing
  const startDrawing = (e: React.MouseEvent) => {
    if (selectedTool !== 'brush' && selectedTool !== 'eraser') return;

    const canvas = canvasRef.current;
    if (!canvas || !contextRef.current) return;

    const rect = canvas.getBoundingClientRect();

    // Canvas scaling values to maintain accuracy
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    console.log("Start Drawing at:", x, y); // Debugging

    setIsDrawing(true);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);

    // **Directly set brush size based on original brush size**
    contextRef.current.lineWidth = brushSize;  // Keep brush size fixed

    contextRef.current.strokeStyle = brushColor;
    contextRef.current.lineCap = "round";
    contextRef.current.lineJoin = "round";

    if (selectedTool === "eraser") {
      contextRef.current.globalCompositeOperation = "destination-out";
      contextRef.current.lineWidth = brushSize * 1.5;  // Eraser a little bigger
    } else {
      contextRef.current.globalCompositeOperation = "source-over";
    }
  };


  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    // Canvas scaling values to maintain accuracy
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    console.log("Draw at:", x, y); // Debugging

    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };


  const stopDrawing = () => {
    setIsDrawing(false);
  };

  // Handle image drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };


  const clickHandler = () => {

    if (backgroundImage || showStickers || showText) return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = (event) => {
      // const file = event.target.files[0];
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file) {
        console.log("Selected Image:", file);
        setBackgroundImage(URL.createObjectURL(file)); // ⬅️ Image preview ke liye
      }
    };

    input.click();
  }


  const applyBgRemover = async () => {
    try {
      if (backgroundImage && !bgremovedImage) {
        setactiveLoader(true);
        const removed = await removeBg(backgroundImage);
        setactiveLoader(false)
        setBgremovedImage(removed)
        setIsDraggable(false);

      }
    }
    catch (error) {
      console.log(error)
    }

  }




  // Handle crop complete
  // const onCropComplete = (croppedArea, croppedAreaPixels) => {
  //   setCroppedAreaPixels(croppedAreaPixels);
  // };

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };


  // Apply crop
  const applyCrop = async () => {
    if (!croppedAreaPixels || !backgroundImage) return;

    const canvas = document.createElement('canvas');
    // const image = new Image();
    const image = new window.Image();
    image.src = backgroundImage;

    await new Promise(resolve => (image.onload = resolve));

    // Set canvas resolution based on cropped area
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw the cropped image onto the new canvas
    ctx.drawImage(
      image,
      croppedAreaPixels.x, croppedAreaPixels.y,
      croppedAreaPixels.width, croppedAreaPixels.height,
      0, 0,
      croppedAreaPixels.width, croppedAreaPixels.height
    );

    // Update the background image with the cropped version
    setBackgroundImage(canvas.toDataURL());

    // Reset cropping state
    setCroppingModeOn(false);
    setIsCropping(false);
    setSelectedTool('none');

    // Reset the main canvas state
    if (canvasRef.current) {
      const mainCanvas = canvasRef.current;
      const mainCtx = mainCanvas.getContext('2d');
      if (mainCtx) {
        const dpr = window.devicePixelRatio || 1;

        // Reset canvas resolution and display size
        mainCanvas.width = croppedAreaPixels.width * dpr;
        mainCanvas.height = croppedAreaPixels.height * dpr;
        mainCanvas.style.width = `${croppedAreaPixels.width}px`;
        mainCanvas.style.height = `${croppedAreaPixels.height}px`;

        // Reset context scaling
        mainCtx.scale(dpr, dpr);

        // Redraw the cropped image onto the main canvas
        mainCtx.drawImage(canvas, 0, 0);

        // Update contextRef
        contextRef.current = mainCtx;

        console.log("Canvas reset after applyCrop:", mainCanvas.width, mainCanvas.height); // Debugging
      }
    }
  };

  const cancelCrop = () => {
    setCroppingModeOn(false);
    setIsCropping(false);
    setSelectedTool('none');

    // Reset the main canvas state
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const dpr = window.devicePixelRatio || 1;

        // Reset canvas resolution and display size
        canvas.width = imgWidth * dpr;
        canvas.height = imgHeight * dpr;
        canvas.style.width = `${imgWidth}px`;
        canvas.style.height = `${imgHeight}px`;

        // Reset context scaling
        ctx.scale(dpr, dpr);

        // Redraw the original background image
        const image = new Image();
        image.src = backgroundImage;

        image.onload = () => {
          ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
        };

        // Update contextRef
        contextRef.current = ctx;

        console.log("Canvas reset after cancelCrop:", canvas.width, canvas.height); // Debugging
      }
    }
  };

  // const cancelCrop = () => {
  //   setIsCropping(false)
  //   setCroppingModeOn(false)
  // }



  return (


    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {activeLoader && (<LoaderComp />)}

      {/* Left Sidebar - Main Tools */}
      <div className={`${leftSidebarOpen ? 'w-16 md:w-20' : 'w-0'} transition-all duration-300 bg-gray-800/95 backdrop-blur-sm p-3 flex flex-col gap-4 items-center border-r border-gray-700 relative z-50`}>
        <button
          onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
          className="absolute -right-3 top-4 bg-indigo-600 p-1 rounded-full hover:bg-indigo-700 transition-colors  cust-z-index"
        >
          <PanelLeftClose size={16} className={`transform transition-transform duration-300 ${!leftSidebarOpen ? 'rotate-180' : ''}`} />
        </button>
        {leftSidebarOpen && (
          <>
            {[
              { icon: <ImagePlus size={24} />, tooltip: "Add Image", tool: 'none' as Tool },
              { icon: <Brush size={24} />, tooltip: "Brush", tool: 'brush' as Tool },
              { icon: <Eraser size={24} />, tooltip: "Eraser", tool: 'eraser' as Tool },
              { icon: <Shapes size={24} />, tooltip: "Shapes", tool: 'none' as Tool },
              { icon: <Type size={24} />, tooltip: "Text", tool: 'text' as Tool },
              { icon: <Sticker size={24} />, tooltip: "Stickers", tool: 'sticker' as Tool },
              { icon: <Crop size={24} />, tooltip: "Crop", tool: 'crop' as Tool },
              { icon: <Filter size={24} />, tooltip: "Filters", tool: 'none' as Tool },
              { icon: <Layers size={24} />, tooltip: "Layers", tool: 'none' as Tool },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleToolClick(item.tool)}
                className={`p-2 rounded-lg transition-all duration-200 group relative hover:scale-110 
                  ${selectedTool === item.tool ? 'bg-indigo-600' : 'hover:bg-indigo-600'}  ${(bgremovedImage && item.tool === 'crop') ? 'opacity-50 bg-transparent hover:bg-transparent' : ''}`}
                title={item.tooltip}
              >
                {item.icon}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"  >
                  {item.tooltip}
                </span>
              </button>
            ))}
          </>
        )}
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Toolbar */}
        <div className="h-16 bg-gray-800/95 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4 md:px-6">
          <div className="flex gap-2 md:gap-4">
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors group">
              <Undo size={20} className="group-hover:scale-110 transition-transform" />
            </button>
            <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors group">
              <Redo size={20} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            {isCropping ? (
              <>

                <button
                  onClick={cancelCrop}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <X size={20} />
                  Cancel Crop
                </button>

                <button
                  onClick={applyCrop}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Check size={20} />
                  Apply Crop
                </button>

              </>


            ) :

              (backgroundImage && !bgremovedImage) && (
                <button
                  onClick={applyBgRemover}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Check size={20} />
                  Text Behind
                </button>
              )


            }

            <button className="hidden md:flex px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg items-center gap-2 transition-colors">
              <Sparkles size={18} className="text-yellow-400" />
              AI Enhance
            </button>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors group">
              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 bg-[#1a1a1a] p-4 md:p-8 flex items-center justify-center overflow-auto" >
            <div
              className="relative w-full max-w-[900px] aspect-[4/3] bg-white rounded-xl shadow-2xl flex items-center justify-center text-gray-400 group" style={{ marginTop: '150px' }}
              onDrop={isDraggable ? handleDrop : undefined}  // 🔥 Disable drag events
              onDragOver={isDraggable ? handleDragOver : undefined}
              onMouseMove={isDraggable ? handleMouseMove : undefined}
              onMouseUp={isDraggable ? handleMouseUp : undefined}
              onClick={isDraggable ? clickHandler : undefined}
            >
              {/* Background Image */}
              {backgroundImage && !isCropping && (
                <>
                  <div className="relative flex items-center justify-center w-full max-w-[900px] aspect-[4/3] bg-white rounded-xl shadow-2xl overflow-hidden">
                    <div className="relative w-full h-full flex items-center justify-center">
                      {/* Background Image */}
                      <img
                        src={backgroundImage}
                        alt="Background"
                        className="max-w-full max-h-full object-contain z-10"
                        onLoad={(e) => {
                          const img = e.target;
                          const parent = img.parentElement;
                          if (parent) {
                            const parentWidth = parent.clientWidth;
                            const parentHeight = parent.clientHeight;
                            const imgRatio = img.naturalWidth / img.naturalHeight;
                            const parentRatio = parentWidth / parentHeight;

                            if (imgRatio > parentRatio) {
                              // Fit width-wise
                              setImgWidth(parentWidth);
                              setImgHeight(parentWidth / imgRatio);
                            } else {
                              // Fit height-wise
                              setImgWidth(parentHeight * imgRatio);
                              setImgHeight(parentHeight);
                            }
                          }
                        }}
                        style={{ width: imgWidth, height: imgHeight }}
                      />

                      {/* 📌 Fixed: Text Inside Image Boundaries */}
                      {/* {backgroundImage && bgremovedImage && ( */}

                      {texts.map((text) => (
                        <p
                          key={text.id}
                          className="absolute flex items-center justify-center text-black text-center break-words z-20"
                          style={{
                            maxWidth: imgWidth,
                            maxHeight: imgHeight,
                            wordWrap: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            padding: '4px',
                            fontSize: text.size,
                            fontFamily: text.fontFamily,
                            fontStyle: (text.italic) ? 'italic' : '',
                            fontWeight: (text.bold) ? 'bold' : '',
                          }}
                        >
                          {text.content}
                        </p>
                      ))}
                      {/* )} */}


                      {/* Foreground Image (Removed BG) */}
                      {bgremovedImage && (
                        <img
                          src={bgremovedImage}
                          alt="Foreground"
                          className="absolute z-30"
                          style={{ width: imgWidth, height: imgHeight, objectFit: "contain" }}
                        />
                      )}
                    </div>
                  </div>
                </>
              )}



              {/* Crop Tool */}
              {isCropping && backgroundImage && (
                <div className="absolute inset-0 z-30">
                  <Cropper
                    image={backgroundImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={aspect}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                  />
                </div>
              )}

              {/* Drawing Canvas */}
              {!isCropping && (
                <canvas
                  ref={canvasRef}
                  className="absolute w-full h-full rounded-xl"
                  style={{ zIndex: selectedTool === 'brush' || selectedTool === 'eraser' ? 50 : 40, width: imgWidth, height: imgHeight }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              )}

              {/* Stickers Layer */}
              {!isCropping && stickers.map(sticker => (
                <Image
                  key={sticker.id}
                  src={sticker.src}
                  alt="Sticker"
                  className="absolute w-16 h-16 object-contain cursor-move"
                  style={{
                    left: sticker.x,
                    top: sticker.y,
                    zIndex: 15,
                    transform: draggedSticker === sticker.id ? 'scale(1.1)' : 'scale(1)',
                    transition: 'transform 0.2s'
                  }}
                  onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}
                />
              ))}

              {/* Upload Prompt */}
              {!backgroundImage && (
                <div className="relative z-0">
                  <ImageIcon size={48} className="opacity-50 group-hover:scale-110 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <p className="text-lg font-medium mb-2" style={{ width: '250px' }}>Drop image or click to upload</p>
                      <p className="text-sm text-gray-500">Supports JPG, PNG, WebP</p>
                    </div>
                  </div>
                </div>
              )}

              {/* GIPHY Sticker Selector */}
              {showStickers && (
                <div className="absolute top-4 left-4 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-50 w-72">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">GIPHY Stickers</span>
                    <button
                      onClick={() => setShowStickers(false)}
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Search stickers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 mb-3 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                  <div className="h-64 overflow-y-auto">
                    <Grid
                      width={250}
                      columns={2}
                      fetchGifs={async (offset: number) => gf.search(searchQuery || "trending", { limit: 50, type: "stickers", offset })}
                      onGifClick={(gif, e) => {
                        e.preventDefault(); // ⛔️ Prevent Giphy site from opening
                        e.stopPropagation(); // ⛔️ Stop click event from bubbling to `<a>` tag
                        handleGiphySelect(gif); // ✅ Select the GIF properly
                      }}
                      noLink={true} // ✅ Disable default link behavior
                    />

                  </div>
                </div>
              )}


              {/* show Text */}
              {showText && (
                <div className="absolute left-4 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-50 w-72">
                  <h2 className="text-white mb-2">Text Layers</h2>

                  <div className='max-h-96 overflow-y-auto'>
                    {texts.map((text, index: number) => (
                      <div
                        key={text.id}
                        className={`p-2 rounded cursor-pointer flex justify-between ${activeTextId === text.id ? "bg-slate-500 text-white" : "bg-gray-700 text-gray-300"
                          }`}
                        onClick={() => setActive(text.id)}
                      >
                        {/* <span>{text.content} {index + 1}</span> */}
                        <span>
                          {text.content.length > 20
                            ? `${index + 1}. ${text.content.substring(0, 20)}...`
                            : `${index + 1}. ${text.content}`}
                        </span>
                        <button className="ml-2 text-red-400" onClick={() => deleteText(text.id)}><Trash2 /></button>
                      </div>
                    ))}

                  </div>

                  <Button onClick={addText} className=" mt-2 px-4 rounded-lg transition-all duration-200 group relative hover:scale-110 bg-indigo-600 hover:bg-indigo-700"><Plus /> Add Text</Button>
                </div>
              )}
            </div>
          </div>





          {/* Right Sidebar - Properties */}
          {/* Right Sidebar - Properties */}
          <div
            className={`${rightSidebarOpen ? 'w-72 md:w-80' : 'w-0'} transition-all duration-300 bg-gray-800/95 backdrop-blur-sm border-l border-gray-700 relative`}
          >
            <button
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="absolute -left-3 top-4 bg-indigo-600 p-1 rounded-full hover:bg-indigo-700 transition-colors z-50"
            >
              <PanelRightClose size={16} className={`transform transition-transform duration-300 ${!rightSidebarOpen ? 'rotate-180' : ''}`} />
            </button>


            {rightSidebarOpen && (
              <div className="h-full p-6 overflow-y-auto">

                {
                  !croppingModeOn ?

                    <div className="space-y-6">
                      {/* Text Properties */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Type size={20} className="text-indigo-400" />
                          Text Properties
                        </div>


                        <input
                          type="text"
                          placeholder="Enter text..."
                          className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                          value={
                            backgroundImage
                              ? texts.find((text) => text.id === activeTextId)?.content || ""
                              : ""
                          }
                          onChange={(e) => {
                            const updatedTexts = texts.map((text) =>
                              text.id === activeTextId
                                ? { ...text, content: e.target.value } // Active text update hoga
                                : text
                            );
                            setTexts(updatedTexts);
                          }}
                        />


                        {/* <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors">
                          <option>Arial</option>
                          <option>Helvetica</option>
                          <option>Times New Roman</option>
                          <option>Roboto</option>
                        </select> */}


                        {/* <FontSelector
                          selectedFont={selectedFont}
                          setSelectedFont={setSelectedFont}
                          isPremiumUser={isPremiumUser}
                        /> */}

                        <FontSelector
                          selectedFont={selectedFont}
                          setSelectedFont={(font: string) => {
                            setSelectedFont(font);
                            setTexts((prevTexts) =>
                              prevTexts.map((text) =>
                                text.id === activeTextId ? { ...text, fontFamily: font } : text
                              )
                            );
                          }}
                          isPremiumUser={isPremiumUser}
                        />


                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Size(px)"
                            className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                            // onChange={(e)=>setTexts(texts[activeTextId].size(e.target.value))}
                            value={
                              texts.find((text) => text.id === activeTextId)?.size.replace('px', '') || ''
                            }
                            onChange={(e) => {
                              let newSize = parseInt(e.target.value, 10);
                              if (isNaN(newSize)) return; // Agar invalid number ho toh kuch na kare

                              // Limiting logic
                              newSize = Math.max(10, Math.min(newSize, 120));

                              // Add 'px' suffix
                              const newSizeWithPx = `${newSize}px`;

                              console.log('new size is', newSizeWithPx);

                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId ? { ...text, size: newSizeWithPx } : text
                                )
                              );
                            }}
                          />
                          {/* <button className="flex-1 bg-gray-700/50 hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors">
                            Bold
                          </button> */}
                          <button
                            className={`flex-1 ${texts.find((text) => text.id === activeTextId)?.bold
                              ? 'bg-gray-600'
                              : 'bg-gray-700/50'} 
                              hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors`}
                            onClick={() =>
                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId
                                    ? { ...text, bold: !text.bold }
                                    : text
                                )
                              )
                            }
                          >

                            Bold
                          </button>


                          <button
                            className={`flex-1 ${texts.find((text) => text.id === activeTextId)?.italic
                              ? 'bg-gray-600'
                              : 'bg-gray-700/50'} 
                            hover:bg-gray-600 rounded-lg px-3 py-2 transition-colors`}
                            onClick={() =>
                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId
                                    ? { ...text, italic: !text.italic }
                                    : text
                                )
                              )
                            }
                          >
                            Italic
                          </button>
                        </div>
                      </div>

                      {/* Color Properties */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Palette size={20} className="text-indigo-400" />
                          Color
                        </div>
                        <div className="grid grid-cols-6 gap-2">
                          {[
                            '#E63946', // Red
                            '#F4A261', // Orange
                            '#2A9D8F', // Teal
                            '#264653', // Deep Navy
                            '#A8DADC', // Aqua
                            '#457B9D', // Blue
                            '#1D3557', // Dark Blue
                            '#F4D35E', // Yellow
                            '#EE6C4D', // Coral
                            '#3D405B', // Greyish Blue
                            '#C56C86', // Rose Pink
                            '#6A0572'  // Purple
                          ]
                            .map((color, index) => (
                              <button
                                key={index}
                                className="w-8 h-8 rounded-lg border border-gray-600 hover:scale-110 transition-transform"
                                style={{ backgroundColor: color }}

                              />
                            ))}
                        </div>
                        {/* <input
                          type="color"
                          className="w-full h-10 bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
                        /> */}

                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              className="h-9 w-full border-2"
                            // style={{ backgroundColor: selectedColor }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                          <HexColorPicker  color={selectedColor} onChange={(newcolor)=>setSelectedColor(newcolor)} />

                          <HexColorInput 
    color={selectedColor} 
    onChange={(newColor) => setSelectedColor(newColor)} 
    className="w-full bg-gray-800 text-white border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
  />

                          </PopoverContent>
                        </Popover>


                      </div>

                      {/* Effects */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Wand2 size={20} className="text-indigo-400" />
                          Effects
                        </div>
                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Brightness</span>
                              <span className="text-indigo-400">50%</span>
                            </div>
                            <input
                              type="range"
                              className="w-full accent-indigo-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Contrast</span>
                              <span className="text-indigo-400">50%</span>
                            </div>
                            <input
                              type="range"
                              className="w-full accent-indigo-500"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Saturation</span>
                              <span className="text-indigo-400">50%</span>
                            </div>
                            <input
                              type="range"
                              className="w-full accent-indigo-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <SlidersHorizontal size={20} className="text-indigo-400" />
                          Advanced
                        </div>
                        <div className="space-y-2">
                          <button className="w-full bg-gray-700/50 hover:bg-gray-600 rounded-lg px-4 py-2 text-left transition-colors hover:pl-6 duration-200">
                            Filters
                          </button>
                          <button className="w-full bg-gray-700/50 hover:bg-gray-600 rounded-lg px-4 py-2 text-left transition-colors hover:pl-6 duration-200">
                            Adjustments
                          </button>
                          <button className="w-full bg-gray-700/50 hover:bg-gray-600 rounded-lg px-4 py-2 text-left transition-colors hover:pl-6 duration-200">
                            Transform
                          </button>
                        </div>
                      </div>
                    </div>

                    :



                    <div className="space-y-6">
                      {/* Text Properties */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-lg font-semibold">
                          <Type size={20} className="text-indigo-400" />
                          Select Ratio
                        </div>

                        <select className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors" onChange={(e) => setAspect(eval(e.target.value))}>
                          <option value="1/1">1:1 (Square)</option>
                          <option value="4/3">4:3 (Standard Photo)</option>
                          <option value="16/9">16:9 (YouTube, Widescreen)</option>
                          <option value="3/2">3:2 (DSLR Photo)</option>
                          <option value="5/4">5:4 (Frame Prints)</option>
                          <option value="9/16">9:16 (Stories, TikTok)</option>
                          <option value="2/3">2:3 (Portrait Photo)</option>
                          <option value="21/9">21:9 (Cinematic)</option>
                        </select>

                        {/* <div style={{textAlign:'center'}}>
                          or
                        </div> */}

                        {/* <div className="flex gap-4 justify-center">
                          <input
                            type="number"
                            placeholder="width"
                            className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                            
                          />
                          <input
                            type="number"
                            placeholder="height"
                            className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                          />
                         
                        </div> */}
                      </div>



                    </div>



                }




              </div>
            )}
          </div>
        </div>
      </div>

      <Toaster position='top-center' theme='light' />
    </div>

  );
}

export default Editor;