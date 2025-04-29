'use client';

import React, { useState, useRef, useEffect } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { UserButton, SignedIn } from "@clerk/nextjs";
import {
  Type,
  Palette,
  ImagePlus,
  Undo,
  Redo,
  Download,
  Crop,
  SlidersHorizontal,
  Brush,
  Eraser,
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
  SquareDashed,
  Crown,
  ToggleLeft,
  ToggleRight,
  BrushIcon,
  EraserIcon,
} from 'lucide-react';
import { removeBg } from '../utils/removeBg';
import LoaderComp from '../components/LoaderComp';
// import Image from 'next/image';
import FontSelector from '../components/Fonts';
import fonts from '@/app/font/font.json';
import { Button } from '@/components/ui/button';
import { toast, Toaster } from 'sonner';
import { HexColorInput, HexColorPicker } from "react-colorful";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import Colors from '../utils/Colors';
import { Toggle } from "@/components/ui/toggle"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import StickerComp from '../components/Sticker';
import filtersData from '@/app/filters/filtersData.json'
import { upscaleImage } from '../components/Upscaler';
import * as htmlToImage from 'html-to-image';
import { blobUrlToDataUrl } from '@/lib/blobToBase64';
import ScreenMismatch from '../components/ScreenMismatch';
import HandleState from './HandleState';

type Tool = 'brush' | 'eraser' | 'text' | 'sticker' | 'crop' | 'filters' | 'none';
type Sticker = { id: number; src: string; x: number; y: number; size: number };

// Initialize GIPHY API

function Editor() {
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [selectedTool, setSelectedTool] = useState<Tool>('none');
  const [showStickers, setShowStickers] = useState(false);
  const [stickers, setStickers] = useState<Sticker[]>([]);
  const [currSticker, setcurrSticker] = useState(0)
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
  const [brushColor, setBrushColor] = useState("black");
  const [brushSize, setBrushSize] = useState(3);
  const [eraserSize, setErazorsize] = useState(1.5);
  const [showText, setshowText] = useState(false)
  const [outline, setOutline] = useState(false);
  const [showFilters, setFilters] = useState('none');

  const [selectedColor, setSelectedColor] = useState('#000000');
  const [activesticker, setActivesticker] = useState(false);


  // const [text, setText] = useState("Your Text Here");
  const [texts, setTexts] = useState<{ id: number; content: string; fontFamily: string; size: string; bold: boolean; italic: boolean, color: string, top: string, left: string, rotate: number, width: string, height: string, shadow: [number, number, number, string], hasShadow: boolean, textImage: string, gradient: [number, string, string], isgradient: boolean }[]>([
    { id: Date.now(), content: "Design Your Words, Define Your World.", fontFamily: "Inter, sans-serif", size: 'clamp(12px, 4vw, 100px)', bold: false, italic: false, color: '#000000', top: '', left: '', rotate: 0, width: '', height: '', shadow: [4, 4, 4, 'black'], hasShadow: true, textImage: "", gradient: [90, '#FF6B6B', "#4A90E2"], isgradient: true },
  ]);
  // const [activeTextId, setActiveTextId] = useState<number>(texts[0].id);
  const [activeTextId, setActiveTextId] = useState<number | null>(texts[0]?.id || null);



  // const [selectedFont, setSelectedFont] = useState(fonts[0].value); 
  const [selectedFont, setSelectedFont] = useState(texts[0]?.fontFamily || fonts[0].value);
  const isPremiumUser = false;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [aspect, setAspect] = useState(1);

  const [croppingModeOn, setCroppingModeOn] = useState(false)

  const [beforeenhancedImg, setBeforeenhancedImg] = useState('')


  useEffect(() => {
    const activeText = texts.find((text) => text.id === activeTextId);
    if (activeText) {
      setSelectedFont(activeText.fontFamily);
    }
  }, [activeTextId, texts]);


  // =====To close sidebar feature open container when click outside that container=====//
  const textContainerRef = useRef<HTMLDivElement>(null);
  const stickerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (textContainerRef.current && !textContainerRef.current.contains(target)) {
        setshowText(false);
      }

      if (stickerContainerRef.current && !stickerContainerRef.current.contains(target)) {
        setShowStickers(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  // =====To close sidebar feature open container when click outside that container=====//


  // -=-=-=-=For text-=-=-=-//
  // -=-=-=-=For text-=-=-=-//
  const addText = () => {
    if (texts.length < 4) {
      const newText = {
        id: Date.now(),
        content: "New Text",
        fontFamily: 'Inter, sans-serif',
        size: 'clamp(12px, 3vw, 100px)',
        bold: false,
        italic: false,
        color: '#000000',
        top: '',
        left: '',
        rotate: 0,
        width: '',
        height: '',
        shadow: [4, 4, 4, 'black'] as [number, number, number, string],
        hasShadow: true,
        textImage: "",
        gradient: [90, '#FF6B6B', "#4A90E2"] as [number, string, string],
        isgradient: true
      };
      setTexts([...texts, newText]);
      setActiveTextId(newText.id);

    } else {
      // alert("Max 10 text layers allowed!");
      toast("Maximum 4 text layers allowed!", {
        description: 'Subscribe for more layers'
      })
    }
  };

  // const updateText = (id: number, newContent: string) => {
  //   setTexts((prev) =>
  //     prev.map((text) => (text.id === id ? { ...text, content: newContent } : text))
  //   );
  // };

  const setActive = (id: number) => {
    setActiveTextId(id);
    console.log('active text...', activeTextId)
  };


  const deleteText = (id: number) => {
    console.log("id is...", id);
    if (texts.length === 1) {
      toast("Minimum one layer should be there");
      return;
    }

    setTexts((prev) => {
      const newTexts = prev.filter((text) => text.id !== id);

      setActiveTextId((prevActiveId) => {
        // 🔥 Agar delete hone wala active hai, tabhi naya active set kar
        if (prevActiveId === id) {
          return newTexts.length > 0 ? newTexts[0].id : null;
        }
        return prevActiveId; // 🔥 Nahi toh wahi active rehne de
      });

      return newTexts;
    });
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

  console.log("Selected Font:", selectedFont);

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
  }, [isCropping, imgWidth, imgHeight]);

  // Handle tool selection
  const handleToolClick = (tool: Tool) => {
    console.log('selected toollll..', selectedTool)
    if (!backgroundImage) return;
    setSelectedTool(tool);
    if (tool === 'sticker') {
      setShowStickers((state) => {
        return !state
      });
      setshowText(false);
      setActivesticker(true);
      setIsCropping(false);

    } else if (tool === 'crop' && backgroundImage && !bgremovedImage) {
      setIsCropping(true);
      // setRightSidebarOpen(false);
      setCroppingModeOn(true)
      setActivesticker(false)
    }
    else if (tool === 'text') {
      setshowText(!showText);
      setShowStickers(false);
      setActivesticker(false)
      setIsCropping(false);
    }
    else if (tool === 'filters') {
      // setshowText(false);
      setShowStickers(false);
      setActivesticker(false)
      setIsCropping(false);
    }
    else {
      setShowStickers(false);
      setActivesticker(false)
    }
  };

  // Handle sticker movement
  // const handleStickerMouseDown = (e: React.MouseEvent, id: number) => {
  //   if (selectedTool !== 'none') return;
  //   setDraggedSticker(id);
  // };


  const handleStickerMouseDown = (e: React.MouseEvent, stickerId: number) => {
    setcurrSticker(stickerId);
    console.log("🖱️ Sticker Mouse Down:", stickerId);

    const stickerIndex = stickers.findIndex(sticker => sticker.id === stickerId);
    if (stickerIndex === -1) return;

    const sticker = stickers[stickerIndex];
    const offsetX = e.clientX - sticker.x;
    const offsetY = e.clientY - sticker.y;

    let wid = sticker.size;
    let hig = sticker.size;
    wid = wid * imgWidth;
    hig = hig * imgHeight;
    console.log('width...', wid)

    const handleStickerMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(e.clientX - offsetX, imgWidth - wid)); // ✅ Sticker container ke andar rahega
      // const newY = Math.max(0, Math.min(e.clientY - offsetY, imgHeight - 100));
      const newY = Math.max(0, Math.min(e.clientY - offsetY, imgHeight - hig));

      setStickers(prevStickers =>
        prevStickers.map(s =>
          s.id === stickerId ? { ...s, x: newX, y: newY } : s
        )
      );
    };

    const handleStickerMouseUp = () => {
      console.log('actice sticker...', activesticker, stickerId)
      console.log(' stickerzz...', sticker)
      console.log('sticker...', stickers)
      if (!activesticker) return;
      console.log("🛑 Mouse Up - Dragging Stopped!");

      document.removeEventListener("mousemove", handleStickerMouseMove);
      document.removeEventListener("mouseup", handleStickerMouseUp);
    };

    document.addEventListener("mousemove", handleStickerMouseMove);
    document.addEventListener("mouseup", handleStickerMouseUp);
    document.addEventListener("mouseleave", handleStickerMouseUp);
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
  const handleStickerSelect = (stickerUrl: string) => {
    setStickers(prev => {
      const stickerWidth = 100; // ✅ Sticker ka width
      const stickerHeight = 100; // ✅ Sticker ka height

      const newSticker = {
        id: Date.now(),
        src: stickerUrl,
        x: Math.min(Math.random() * (imgWidth - stickerWidth), imgWidth - stickerWidth),
        y: Math.min(Math.random() * (imgHeight - stickerHeight), imgHeight - stickerHeight),
        size: .1
      };
      setcurrSticker(newSticker.id);
      setShowStickers(false);
      return [...prev, newSticker];
    });
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
      // contextRef.current.lineWidth = brushSize * 1.5;  
      contextRef.current.lineWidth = brushSize * eraserSize;
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
        setImgWidth(0);
        setImgHeight(0);
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
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setImgWidth(0);
          setImgHeight(0)

          setBackgroundImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
  }


  const isValidImage = (src: string) => {
    const allowedExtensions = /\.(png|jpe?g|webp)$/i;
    const isBase64 = src.startsWith("data:image/");
    const isBase64Allowed = /data:image\/(png|jpe?g|webp)/i.test(src);

    return (allowedExtensions.test(src) || (isBase64 && isBase64Allowed));
  };


  const applyBgRemover = async () => {
    try {

      console.log('image bggg...', backgroundImage)

      if (backgroundImage && !isValidImage(backgroundImage)) {
        toast("Please upload a valid image file (only PNG, JPEG, or WEBP allowed)");
        return;
      }


      if (backgroundImage && !bgremovedImage) {
        setactiveLoader(true);
        const removed = await removeBg(backgroundImage);
        setSelectedTool('text');
        try {
          if (removed) {
            const base64img = await blobUrlToDataUrl(removed)
            setBgremovedImage(base64img)
            setactiveLoader(false)
            setIsDraggable(false);
          }
          else {
            toast('Some thing went worng', {
              description: 'Please upgrade or try later'
            })
          }

        }
        catch (error) {
          console.error('error to convert to base64', error)
        }


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
        if (backgroundImage) {
          const image = new window.Image();
          image.src = backgroundImage;

          image.onload = () => {
            ctx.drawImage(image, 0, 0, imgWidth, imgHeight);
          };
        }

        // Update contextRef
        contextRef.current = ctx;

        console.log("Canvas reset after cancelCrop:", canvas.width, canvas.height); // Debugging
      }
    }
  };


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setTexts((prev) =>
        prev.map((text) =>
          text.id === activeTextId ? { ...text, textImage: imageUrl } : text
        )
      );
    }
    else {
      toast("oops... image upload failed")
    }
  };



  // =-=-===============---Download btn-----------------------//

  const downloadImage = async () => {
    const container = document.getElementById('final-preview');
    if (!container || !imgWidth || !imgHeight) return;

    setactiveLoader(true);

    const originalMargin = container.style.marginTop;
    container.style.marginTop = '0px';
    if (outline) setOutline(false)

    try {
      const pixelRatio = 4; // Higher = Better Quality (try 2–4)

      // Step 1: Get full canvas of the preview
      const fullCanvas = await htmlToImage.toCanvas(container, {
        cacheBust: true,
        pixelRatio,
      });

      // Step 2: Calculate the exact center area based on fixed design size
      const cropWidth = imgWidth * pixelRatio;
      const cropHeight = imgHeight * pixelRatio;
      const centerX = (fullCanvas.width - cropWidth) / 2;
      const centerY = (fullCanvas.height - cropHeight) / 2;

      // Step 3: Create a new canvas with those fixed dimensions
      const croppedCanvas = document.createElement('canvas');
      croppedCanvas.width = cropWidth;
      croppedCanvas.height = cropHeight;

      const ctx = croppedCanvas.getContext('2d');
      if (!ctx) throw new Error("Canvas context not available");

      ctx.drawImage(
        fullCanvas,
        centerX, centerY,
        cropWidth, cropHeight,
        0, 0,
        cropWidth, cropHeight
      );

      // Step 4: Export final image
      const dataUrl = croppedCanvas.toDataURL('image/png');

      const link = document.createElement('a');
      link.download = 'myImage(picfer.com).png';
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error('Image export failed:', err);
      alert('Export failed. Try again.');
    } finally {
      container.style.marginTop = originalMargin;
      setactiveLoader(false);
    }
  };


  // =-=-===============---Download btn-----------------------//



  // -=-=-=-=-=-=UPscale Image-=-=-=-=-=-//
  const upscaleImgfun = async () => {
    if (!backgroundImage) return;

    if (backgroundImage.includes('data-upscaled="true"')) {
      toast("Image is already Enhanced");
      return;
    }

    setactiveLoader(true);
    try {
      const upscaledUrl = await upscaleImage(backgroundImage);
      if (upscaledUrl) {
        // Mark the image as upscaled by adding a custom attribute
        const markedUrl = upscaledUrl.replace(
          /^data:image\/(png|jpeg|jpg);base64,/,
          (match, ext) => `data:image/${ext};data-upscaled="true";base64,`
        );
        setBeforeenhancedImg(backgroundImage);
        setBackgroundImage(markedUrl);
      }
    } catch (error) {
      toast("Upscaling failed. Try again.");
      console.error("Upscaling error:", error);
    } finally {
      setactiveLoader(false);
    }
  };

  // -=-=-=-=-=-=UPscale Image-=-=-=-=-=-//


  // -=-=-=-=-=-=Cancel UPscale Image-=-=-=-=-=-//
  const cancelupscaleImg = () => {
    if (beforeenhancedImg) {
      setBackgroundImage(beforeenhancedImg)
      setBeforeenhancedImg('')
    }
  }
  // -=-=-=-=-=-=Cancel UPscale Image-=-=-=-=-=-//
  
  const colorArray = Colors(selectedColor);



  // =-=-=-=-=-=- states send to DB =-=-=-=-=-=-//
  useEffect(()=>{
    const handleSaveBeforeExit=()=>{
      // HandleState()
    }
    //=-=-=-=-Tab close=-=-=-=//
    window.addEventListener("beforeunload", handleSaveBeforeExit);
    
    //=-=-=-=-Close Browser=-=-=-=//
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        handleSaveBeforeExit();
      }
    });

    // return () => {
    //   window.removeEventListener("beforeunload", handleSaveBeforeExit);
    //   document.removeEventListener("visibilitychange", handleSaveBeforeExit);
    // };
    

  },[])



  console.log('text....', texts)
  console.log('tool....', selectedTool)


  return (


    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">

      <ScreenMismatch />

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
              // { icon: <Shapes size={24} />, tooltip: "Shapes", tool: 'none' as Tool },
              { icon: <Type size={24} />, tooltip: "Text", tool: 'text' as Tool },
              { icon: <Sticker size={24} />, tooltip: "Stickers", tool: 'sticker' as Tool },
              { icon: <Crop size={24} />, tooltip: "Crop", tool: 'crop' as Tool },
              { icon: <Filter size={24} />, tooltip: "Filters", tool: 'filters' as Tool },
              // { icon: <Layers size={24} />, tooltip: "Layers", tool: 'none' as Tool },
            ].map((item, index) => (
              <button
                key={index}
                onClick={() => handleToolClick(item.tool)}
                className={`p-2 rounded-lg transition-all duration-200 group relative hover:scale-110
                  ${selectedTool === item.tool ? 'bg-indigo-600' : 'hover:bg-indigo-600'}  ${(bgremovedImage && item.tool === 'crop') ? 'opacity-50 bg-transparent hover:bg-transparent' : ''}
                  ${!backgroundImage && 'opacity-50 bg-transparent'} 
                  
                  `}
                title={item.tooltip}
              >
                {item.icon}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50"  >
                  {item.tooltip}
                </span>
              </button>




            ))}

            <div className='absolute bottom-2 flex flex-col gap-2 items-center'>

              <div>
                <button
                  // onClick={() => handleToolClick(item.tool)}
                  className={`p-2 rounded-lg transition-all duration-200 group relative hover:scale-110 
                 `}
                >
                  <Crown size={24} className='text-yellow-400' />
                </button>
              </div>

              <SignedIn>
                <UserButton
                // userProfileMode="navigation"
                // userProfileUrl="/profile"
                // redirectUrl="/"
                />
              </SignedIn>
            </div>

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


            {
              backgroundImage && !bgremovedImage && (
                <>
                  {
                    beforeenhancedImg ? (
                      <button className="hidden md:flex px-4 py-2 bg-red-700 hover:bg-red-600 rounded-lg items-center gap-2 transition-colors"
                        onClick={cancelupscaleImg}
                      // onClick={()=>upscaleImage(backgroundImage || "")}
                      >
                        <Sparkles size={18} className="text-yellow-400" />
                        Cancel Enhancement
                      </button>
                    )
                      :
                      (
                        <button className="hidden md:flex px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg items-center gap-2 transition-colors"
                          onClick={upscaleImgfun}
                        // onClick={()=>upscaleImage(backgroundImage || "")}
                        >
                          <Sparkles size={18} className="text-yellow-400" />
                          AI Enhance
                        </button>
                      )
                  }



                </>
              )
            }



            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center gap-2 transition-colors group" onClick={downloadImage}>
              <Download size={20} className="group-hover:translate-y-0.5 transition-transform" />
              <span className="hidden md:inline">Export</span>
            </button>
          </div>
        </div>

        {/* Canvas Container */}
        <div className="flex-1 flex min-h-0">
          <div className="flex-1 bg-[#1a1a1a] p-4 md:p-8 flex items-center justify-center overflow-auto" >
            <div
              id='final-preview'
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
                  <div className="relative flex items-center justify-center w-full max-w-[900px] aspect-[4/3] bg-white rounded-xl shadow-2xl overflow-hidden" style={{ filter: showFilters }}>
                    <div id='final-preview' className="relative w-full h-full flex items-center justify-center overflow-hidden" style={(imgHeight && imgWidth) ? { width: imgWidth + 'px', height: imgHeight + 'px' } : {}}>
                      {/* Background Image */}
                      <img
                        src={backgroundImage}
                        alt="Background"
                        className="max-w-full max-h-full object-contain z-10"
                        onLoad={(e) => {
                          const img = e.target as HTMLImageElement;
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

                      {backgroundImage && bgremovedImage && (
                        texts.map((text) => (
                          <p
                            key={text.id}
                            className={`absolute flex items-center justify-center text-black text-center break-words z-20 ${outline ? "cust-animix-p-ref" : ""
                              }`}
                            style={{
                              // maxWidth: imgWidth,
                              // maxHeight: imgHeight,
                              wordWrap: "break-word",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: text.size,
                              fontFamily: text.fontFamily,
                              fontStyle: text.italic ? "italic" : "",
                              fontWeight: text.bold ? "bold" : "",
                              color: text.color,

                              left: text.left,
                              top: text.top,
                              transform: `rotate(${text.rotate}deg)`,
                              width: text.width,
                              height: text.height,
                              ...(text.textImage && {
                                backgroundImage: `url(${text.textImage})`,
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "center center",
                                backgroundSize: "cover",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }),

                              ...(!text.isgradient && {
                                backgroundImage: `linear-gradient(${text.gradient?.[0] || "0"}deg, ${text.gradient?.[1] || "#000"}, ${text.gradient?.[2] || "#fff"})`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "100%",
                                backgroundPosition: "center",
                                WebkitBackgroundClip: "text",
                                backgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }),

                              filter: !text.hasShadow
                                ? `drop-shadow(${text?.shadow?.[0]}px ${text.shadow[1]}px ${text.shadow[2]}px ${text.shadow[3]})`
                                : "",
                            }}
                          >
                            {text.content}
                          </p>
                        ))
                      )}

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
                  style={{ zIndex: selectedTool === 'brush' || selectedTool === 'eraser' ? 50 : 40, width: imgWidth, height: imgHeight, overflow: 'hidden', cursor: (selectedTool === 'brush' || selectedTool === 'eraser') ? 'url("https://img.icons8.com/?size=20&id=rKqQiYPTkVLU&format=png&color=000000") 6 4, auto' : "default", filter: showFilters }}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                />
              )}

              {/* Stickers Layer */}
              {backgroundImage && !isCropping && (
                <div className='absolute flex items-center justify-center overflow-hidden' style={{ zIndex: activesticker ? 50 : 30, width: imgWidth, height: imgHeight }} >
                  {!isCropping && stickers.map(sticker => (
                    <img
                      key={sticker.id}
                      src={sticker.src}
                      alt="Sticker"
                      className="absolute cursor-move"
                      style={{
                        filter: showFilters,
                        left: `${sticker.x}px`,
                        top: `${sticker.y}px`,
                        zIndex: 15,
                        transform: "scale(1)",
                        transition: "transform 0.1s",
                        width: Math.max(Math.round((sticker.size || 0.1) * imgWidth), Math.round((sticker.size || 0.1) * imgHeight)),
                        // height: Math.max(Math.round(0.1 * imgHeight), Math.round(0.1 * imgHeight)),
                        border: (activesticker && sticker.id === currSticker) ? "1px solid red" : "none",
                        animation: (activesticker && sticker.id === currSticker) ? "blinkBorder 2s infinite" : "none",

                      }}
                      onMouseDown={(e) => handleStickerMouseDown(e, sticker.id)}

                    />
                  ))}
                </div>
              )}





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
                <div className="absolute top-4 left-4 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-50 w-72" ref={stickerContainerRef}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-semibold">Stickers</span>
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
                    {/* <StickerComp onSelect={handleStickerSelect} /> */}
                    <StickerComp onSelect={handleStickerSelect} searchQuery={searchQuery} />


                  </div>
                </div>
              )}


              {/* show Text */}
              {bgremovedImage && showText && (
                <div
                  ref={textContainerRef}
                  className="absolute left-4 bg-gray-800/95 backdrop-blur-sm p-4 rounded-lg border border-gray-700 z-50 w-72">
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
                  // ---------------------------------Text====----------------------------//
                  (bgremovedImage && !croppingModeOn && selectedTool === 'text') ?
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
                            value={texts.find((text) => text.id === activeTextId)?.size.replace('px', '') || ''}

                            // Input ke waqt value control
                            onChange={(e) => {
                              let value = e.target.value;

                              // Agar blank ho toh khaali rakhne de
                              if (value === '') {
                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, size: '' } : text
                                  )
                                );
                                return;
                              }

                              // Valid number check
                              if (!/^\d*$/.test(value)) return;

                              // Max limit lagao (live typing par)
                              if (Number(value) > 500) {
                                value = '500';
                              }

                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId ? { ...text, size: `${value}px` } : text
                                )
                              );
                            }}

                            // Blur pe minimum value fix karo
                            onBlur={(e) => {
                              let value = Number(e.target.value);

                              if (isNaN(value) || value < 10) {
                                value = 10;
                              }

                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId ? { ...text, size: `${value}px` } : text
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
                          {colorArray.map((color, index) => (
                            <button
                              key={index}
                              className="w-8 h-8 rounded-lg border border-gray-600 hover:scale-110 transition-transform"
                              style={{ backgroundColor: color }}
                              onClick={() => {
                                setSelectedColor(color);
                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, color: color } : text
                                  )
                                );
                              }}
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
                              style={{ backgroundColor: selectedColor }}
                            />
                          </PopoverTrigger>
                          <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                            <HexColorPicker color={selectedColor} onChange={(newcolor) => {
                              setSelectedColor(newcolor)
                              setTexts((prevTexts) =>
                                prevTexts.map((text) =>
                                  text.id === activeTextId
                                    ? { ...text, color: newcolor }
                                    : text
                                )
                              )
                            }
                            }
                            />

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
                        <div className="flex justify-between">
                          <div className="flex items-center gap-2 text-lg font-semibold">
                            {/* <Wand2 size={20} className="text-indigo-400" /> */}
                            <SlidersHorizontal size={20} className="text-indigo-400" />
                            Alignment
                          </div>

                          <Toggle
                            onClick={() => { setOutline((prev) => !prev) }}
                          >
                            <SquareDashed />
                          </Toggle>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span>Position X</span>
                              <span className="text-indigo-400">
                                {Math.round(parseFloat(texts.find((row) => row.id === activeTextId)?.left?.replace('px', '') || '0'))}
                              </span>

                            </div>
                            <input
                              type="range"
                              min={(imgWidth) ? -(imgWidth) : '-100'}
                              max={(imgWidth) ? (imgWidth) : '100'}
                              className="w-full accent-indigo-500"
                              onChange={(e) => {
                                const newLeft = `${e.target.value}px`;
                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, left: newLeft } : text
                                  )
                                );
                              }}

                            />
                            <div className="flex items-center justify-between">
                              <span>Position Y</span>
                              <span className="text-indigo-400">
                                {Math.round(parseFloat(texts.find((row) => row.id === activeTextId)?.top?.replace('px', '') || '0'))}
                              </span>

                            </div>
                            <input
                              type="range"
                              min={(imgHeight) ? -(imgHeight) : '-100'}
                              max={(imgHeight) ? (imgHeight) : '100'}
                              className="w-full accent-indigo-500"
                              value={
                                texts.find((row) => row.id === activeTextId)?.top?.replace('px', '') || ''
                              }
                              onChange={(e) => {
                                const newTop = `${e.target.value}px`;
                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, top: newTop } : text
                                  )
                                );
                              }}

                            />

                            <div className="flex items-center justify-between">
                              <span>Rotation</span>
                              <span className="text-indigo-400">{texts.find((row) => row.id === activeTextId)?.rotate}</span>
                            </div>
                            <input
                              type="range"
                              min='-180'
                              max='180'
                              className="w-full accent-indigo-500"
                              value={
                                texts.find((row) => row.id === activeTextId)?.rotate
                              }
                              onChange={(e) => {
                                const newRotate = Number(e.target.value);
                                setTexts((prevNum) =>
                                  prevNum.map((num) =>
                                    num.id === activeTextId ? { ...num, rotate: newRotate } : num
                                  )
                                );
                              }}

                            />


                          </div>


                          <div className="flex justify-between align-middle">
                            <p>Width <span style={{ fontSize: '12px' }} className='text-indigo-400'>(in px)</span></p>

                            <input
                              type="number"
                              min="10"
                              max={imgWidth || undefined} // Agar imgWidth nahi ho toh undefined rahe
                              className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:border-indigo-500 transition-colors"
                              value={(texts.find((text) => text.id === activeTextId)?.width || '').replace('px', '')}

                              onChange={(e) => {
                                const value = e.target.value.trim(); // Extra spaces remove karo

                                if (value === '') {
                                  // Agar input empty ho, toh blank rakho
                                  setTexts((prevTexts) =>
                                    prevTexts.map((text) =>
                                      text.id === activeTextId ? { ...text, width: '' } : text
                                    )
                                  );
                                  return;
                                }

                                // Valid number check
                                if (!/^\d+$/.test(value)) return;

                                let numValue = parseInt(value, 10);

                                // Max limit apply
                                if (imgWidth && numValue > imgWidth) {
                                  numValue = imgWidth;
                                }

                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, width: `${numValue}px` } : text
                                  )
                                );
                              }}
                              onBlur={(e) => {
                                let numValue = parseInt(e.target.value, 10) || 10;
                                console.log('num valllll', numValue)
                                // Ensure minimum 10px width
                                if (numValue <= 10) numValue = 0;

                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, width: numValue ? `${numValue}px` : '' } : text
                                  )
                                );
                              }}
                            />


                          </div>
                          <div className="flex justify-between align-middle">
                            <p>Height <span style={{ fontSize: '12px' }} className='text-indigo-400'>(in px)</span></p>
                            <input
                              type="number"
                              min="10"
                              max={imgHeight || undefined} // Agar imgWidth nahi ho toh undefined rahe
                              className="w-20 bg-gray-700/50 border border-gray-600 rounded-lg px-3 py-1 focus:outline-none focus:border-indigo-500 transition-colors"
                              // value={texts.find((text) => text.id === activeTextId)?.height.replace('px', '') || ''}
                              value={(texts.find((text) => text.id === activeTextId)?.height || '').replace('px', '')}

                              onChange={(e) => {
                                const value = e.target.value.trim(); // Extra spaces remove karo

                                if (value === '') {
                                  // Agar input empty ho, toh blank rakho
                                  setTexts((prevTexts) =>
                                    prevTexts.map((text) =>
                                      text.id === activeTextId ? { ...text, height: '' } : text
                                    )
                                  );
                                  return;
                                }

                                // Valid number check
                                if (!/^\d+$/.test(value)) return;

                                let numValue = parseInt(value, 10);

                                // Max limit apply
                                if (imgHeight && numValue > imgHeight) {
                                  numValue = imgHeight;
                                }

                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, height: `${numValue}px` } : text
                                  )
                                );
                              }}
                              onBlur={(e) => {
                                let numValue = parseInt(e.target.value, 10) || 10;

                                // Ensure minimum 10px width
                                if (numValue <= 10) numValue = 0;

                                setTexts((prevTexts) =>
                                  prevTexts.map((text) =>
                                    text.id === activeTextId ? { ...text, height: (numValue === 0) ? '' : `${numValue}px` } : text
                                  )
                                );
                              }}
                            />

                          </div>




                        </div>
                      </div>

                      {/* Advanced Settings */}

                      <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="item-1" className="border-none">
                          <AccordionTrigger >
                            <div className="flex items-center gap-2 text-lg font-semibold">
                              {/* <SlidersHorizontal size={20} className="text-indigo-400" /> */}
                              <Crown size={20} className="text-indigo-400" />
                              Advanced
                            </div>
                          </AccordionTrigger>
                          <AccordionContent >
                            <div className="bg-slate-700 p-3 rounded-lg ">

                              <div className="flex justify-between">
                                <h4 className='text-lg mb-2'>shadow</h4>
                                <div
                                  className="toggle-wrapper cursor-pointer"
                                  onClick={() => {
                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, hasShadow: !text.hasShadow }
                                          : text
                                      )
                                    );
                                  }}
                                >
                                  {
                                    texts.find((row) => row.id === activeTextId)?.hasShadow
                                      ? <ToggleLeft />
                                      : <ToggleRight style={{ color: 'rgb(34 197 94)' }} />
                                  }
                                </div>

                              </div>


                              <div className='relative' style={texts.find((row) => row.id === activeTextId)?.hasShadow ? { opacity: .3 } : {}}>
                                <div className='absolute w-full h-full' style={texts.find((row) => row.id === activeTextId)?.hasShadow ? { display: 'flex' } : { display: 'none' }}></div>


                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Horizontal offset</span>
                                  <span className="text-indigo-400">
                                    {texts.find((row) => row.id === activeTextId)?.shadow?.[0] ?? 0}
                                  </span>

                                </div>
                                <input
                                  type="range"
                                  min="-30"
                                  max="30"
                                  className="w-full accent-indigo-500"
                                  value={texts.find((row) => row.id === activeTextId)?.shadow?.[0] ?? 0}
                                  onChange={(e) => {
                                    const newNum = Number(e.target.value);

                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, shadow: [newNum, text.shadow[1], text.shadow[2], text.shadow[3]] } // ✅ Correct way to update
                                          : text
                                      )
                                    );
                                  }}
                                />



                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Vertical offset</span>
                                  <span className="text-indigo-400">{texts.find((row) => row.id === activeTextId)?.shadow?.[1] ?? 0}</span>
                                </div>

                                <input
                                  type="range"
                                  min="-30"
                                  max="30"
                                  className="w-full accent-indigo-500"
                                  value={texts.find((row) => row.id === activeTextId)?.shadow?.[1] ?? 0}

                                  onChange={(e) => {
                                    const newNum = Number(e.target.value);

                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, shadow: [text.shadow[0], newNum, text.shadow[2], text.shadow[3]] } // ✅ Correct way to update
                                          : text
                                      )
                                    );
                                  }}
                                />


                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Blur radius</span>
                                  <span className="text-indigo-400">{texts.find((row) => row.id === activeTextId)?.shadow?.[2] ?? 0}</span>
                                </div>

                                <input
                                  type="range"
                                  min="0"
                                  max="40"
                                  className="w-full accent-indigo-500"
                                  value={texts.find((row) => row.id === activeTextId)?.shadow?.[2] ?? 0}

                                  onChange={(e) => {
                                    const newNum = Number(e.target.value);

                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, shadow: [text.shadow[0], text.shadow[1], newNum, text.shadow[3]] } // ✅ Correct way to update
                                          : text
                                      )
                                    );
                                  }}
                                />


                                <div className="flex justify-between items-center">
                                  <span className='text-sm'>Shadow color</span>
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        className="h-9 w-2/4 border-2"
                                        style={{ backgroundColor: texts.find((row) => row.id === activeTextId)?.shadow?.[3] ?? 'black' }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                                      <HexColorPicker color={selectedColor} onChange={(newcolor) => {
                                        setTexts((prevTexts) =>
                                          prevTexts.map((text) =>
                                            text.id === activeTextId
                                              ? { ...text, shadow: [text.shadow[0], text.shadow[1], text.shadow[2], newcolor] }
                                              : text
                                          )
                                        )
                                      }
                                      }
                                      />

                                      <HexColorInput
                                        color={selectedColor}
                                        onChange={(newColor) => {
                                          setTexts((prevTexts) =>
                                            prevTexts.map((text) =>
                                              text.id === activeTextId
                                                ? { ...text, shadow: [text.shadow[0], text.shadow[1], text.shadow[2], newColor] }
                                                : text
                                            )
                                          )
                                        }}
                                        className="w-full bg-gray-800 text-white border border-gray-600  px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                      />

                                    </PopoverContent>
                                  </Popover>
                                </div>

                              </div>

                            </div>


                            {/*=-=-=- Text in Image =-=-=-*/}
                            {/* <div className="bg-slate-700 p-3 rounded-lg mt-3">
                              <div className="flex justify-between">
                                <h4 className='text-lg mb-2'>Image in text</h4>
                              </div>

                              <label className="w-full h-32 bg-gray-700/50 border border-gray-600 rounded-lg flex items-center justify-center cursor-pointer border-dashed">
                                <input
                                  type="file"
                                  accept="image/png, image/jpeg"
                                  style={{ display: "none" }}
                                  onChange={handleImageChange}

                                />
                                {texts.find((row) => row.id === activeTextId)?.textImage ? <img src={texts.find((row) => row.id === activeTextId)?.textImage} alt="image" className="h-32 w-full object-cover" /> : <span>Click to upload image</span>

                                }

                              </label>

                              <div className='text-center'>
                                <Button className='mt-2'
                                  onClick={() => {
                                    setTexts((text) =>
                                      text.map((row) =>
                                        row.id === activeTextId ? { ...row, textImage: '' } : row
                                      )
                                    )
                                  }
                                  }
                                >Remove</Button>
                              </div>

                            </div> */}



                            <div className="bg-slate-700 p-3 rounded-lg mt-3">

                              <div className="flex justify-between">
                                <h4 className='text-lg mb-2'>Gradient</h4>
                                <div
                                  className="toggle-wrapper cursor-pointer"
                                  onClick={() => {
                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, isgradient: !text.isgradient }
                                          : text
                                      )
                                    );
                                  }}
                                >
                                  {
                                    texts.find((row) => row.id === activeTextId)?.isgradient
                                      ? <ToggleLeft />
                                      : <ToggleRight style={{ color: 'rgb(34 197 94)' }} />
                                  }
                                </div>

                              </div>


                              <div className='relative' style={texts.find((row) => row.id === activeTextId)?.isgradient ? { opacity: .3 } : {}}>
                                <div className='absolute w-full h-full' style={texts.find((row) => row.id === activeTextId)?.isgradient ? { display: 'flex' } : { display: 'none' }}></div>


                                <div className="flex"></div>


                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Deg</span>
                                  <span className="text-indigo-400">{texts.find((row) => row.id === activeTextId)?.gradient?.[0] ?? 0}</span>
                                </div>

                                <input
                                  type="range"
                                  min="0"
                                  max="180"
                                  className="w-full accent-indigo-500"
                                  value={texts.find((row) => row.id === activeTextId)?.gradient?.[0] ?? 0}

                                  onChange={(e) => {
                                    const newNum = Number(e.target.value);

                                    setTexts((prevTexts) =>
                                      prevTexts.map((text) =>
                                        text.id === activeTextId
                                          ? { ...text, gradient: [newNum, text.gradient[1], text.gradient[2]] } // ✅ Correct way to update
                                          : text
                                      )
                                    );
                                  }}
                                />


                                <div className="flex justify-between items-center gap-3">

                                  {/*=--=-=============- color 1 =============================*/}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        className="h-9 w-2/4 border-2"
                                        style={{ backgroundColor: texts.find((row) => row.id === activeTextId)?.gradient?.[1] ?? 'black' }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                                      <HexColorPicker color={selectedColor} onChange={(newcolor) => {
                                        setTexts((prevTexts) =>
                                          prevTexts.map((text) =>
                                            text.id === activeTextId
                                              ? { ...text, gradient: [text.gradient[0], newcolor, text.gradient[2]] }
                                              : text
                                          )
                                        )
                                      }
                                      }
                                      />

                                      <HexColorInput
                                        color={selectedColor}
                                        onChange={(newcolor) => {
                                          setTexts((prevTexts) =>
                                            prevTexts.map((text) =>
                                              text.id === activeTextId
                                                ? { ...text, gradient: [text.gradient[0], newcolor, text.gradient[2]] }
                                                : text
                                            )
                                          )
                                        }}
                                        className="w-full bg-gray-800 text-white border border-gray-600  px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                      />

                                    </PopoverContent>
                                  </Popover>

                                  {/*=--=-=============- color 2 =============================*/}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <Button
                                        className="h-9 w-2/4 border-2"
                                        style={{ backgroundColor: texts.find((row) => row.id === activeTextId)?.gradient?.[2] ?? 'black' }}
                                      />
                                    </PopoverTrigger>
                                    <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                                      <HexColorPicker color={selectedColor} onChange={(newcolor) => {
                                        setTexts((prevTexts) =>
                                          prevTexts.map((text) =>
                                            text.id === activeTextId
                                              ? { ...text, gradient: [text.gradient[0], text.gradient[1], newcolor] }
                                              : text
                                          )
                                        )
                                      }
                                      }
                                      />

                                      <HexColorInput
                                        color={selectedColor}
                                        onChange={(newcolor) => {
                                          setTexts((prevTexts) =>
                                            prevTexts.map((text) =>
                                              text.id === activeTextId
                                                ? { ...text, gradient: [text.gradient[0], text.gradient[1], newcolor] }
                                                : text
                                            )
                                          )
                                        }}
                                        className="w-full bg-gray-800 text-white border border-gray-600  px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                      />

                                    </PopoverContent>
                                  </Popover>
                                </div>

                              </div>


                            </div>

                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>


                    </div>

                    :
                    // ---------------------------------Cropping====----------------------------//
                    (croppingModeOn && selectedTool === 'crop') ? (
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
                    )
                      :
                      // ---------------------------------Sticker====----------------------------//
                      (selectedTool === 'sticker') ? (
                        <div className="space-y-6">
                          {/* Text Properties */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold">
                              <Type size={20} className="text-indigo-400" />
                              Select dimension
                            </div>


                            <div className="flex items-center justify-between">
                              <span className='text-sm'>size</span>
                              <span className="text-indigo-400">{Math.round((stickers.find((row) => row.id === currSticker)?.size ?? 0.01) * 100)}</span>
                            </div>

                            <input
                              type="range"
                              min="1"
                              max="30"
                              className="w-full accent-indigo-500"
                              value={(stickers.find((row) => row.id === currSticker)?.size ?? 0.01) * 100}

                              onChange={(e) => {
                                const newNum = Number(e.target.value) / 100;

                                setStickers((prevStick) =>
                                  prevStick.map((stick) =>
                                    stick.id === currSticker
                                      ? { ...stick, size: newNum }
                                      : stick
                                  )
                                );
                              }}
                            />


                            <Button
                              onClick={() => {
                                setStickers((prevStick) =>
                                  prevStick.filter((stick) => stick.id !== currSticker)
                                );
                              }}
                            >
                              Remove
                            </Button>



                            <p className='text-gray-300 text-sm'>Left click on sticker + drag to move sticker(once draged then you can move without left click). </p>
                            <p className='text-gray-300 text-sm'>Right click again to stop movement</p>

                          </div>
                        </div>
                      )
                        :
                        (selectedTool === 'brush') ?
                          (
                            <div className="space-y-6">
                              {/* Text Properties */}
                              <div className="space-y-4">
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                  <BrushIcon size={20} className="text-indigo-400" />
                                  Brush Property
                                </div>


                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Thinkness</span>
                                  <span className="text-indigo-400">{brushSize}</span>
                                </div>

                                <input
                                  type="range"
                                  min="1"
                                  max="30"
                                  className="w-full accent-indigo-500"
                                  value={brushSize}

                                  onChange={(e) => {
                                    const newNum = Number(e.target.value);

                                    setBrushSize(newNum);
                                  }}
                                />



                                <div className="flex items-center justify-between">
                                  <span className='text-sm'>Color</span>
                                  <span className="text-indigo-400">{brushColor}</span>
                                </div>

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      className="h-9 w-full border-2"
                                      style={{ backgroundColor: brushColor }}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent className="p-2 w-fit bg-gray-800 border border-gray-700 rounded-lg">
                                    <HexColorPicker color={selectedColor} onChange={(newcolor) => {
                                      setBrushColor(newcolor);
                                    }
                                    }
                                    />

                                    <HexColorInput
                                      color={selectedColor}
                                      onChange={(newcolor) => {
                                        setBrushColor(newcolor);
                                      }}
                                      className="w-full bg-gray-800 text-white border border-gray-600  px-3 py-2 focus:outline-none focus:border-indigo-500 transition-colors"
                                    />

                                  </PopoverContent>
                                </Popover>


                                <Button onClick={() => { resetCanvas() }}>Clear</Button>

                                <p className='text-gray-300 text-sm mt-4'>Brush size is same for all draw untill you change size.</p>

                              </div>
                            </div>
                          )

                          :

                          (selectedTool === 'eraser') ?
                            (
                              <div className="space-y-6">
                                {/* Text Properties */}
                                <div className="space-y-4">
                                  <div className="flex items-center gap-2 text-lg font-semibold">
                                    <EraserIcon size={20} className="text-indigo-400" />
                                    Eraser Property
                                  </div>


                                  <div className="flex items-center justify-between">
                                    <span className='text-sm'>Thinkness</span>
                                    <span className="text-indigo-400">{eraserSize}</span>
                                  </div>

                                  <input
                                    type="range"
                                    min="0"
                                    max="10"
                                    className="w-full accent-indigo-500"
                                    value={eraserSize}
                                    onChange={(e) => {
                                      const newNum = Number(e.target.value);
                                      setErazorsize(newNum);
                                    }}
                                  />

                                  <Button onClick={() => { resetCanvas() }}>Clear</Button>

                                  <p className='text-gray-300 text-sm mt-4'>Change size of Eraser or reset entire drawing</p>

                                </div>
                              </div>
                            )
                            :
                            (selectedTool === 'filters') ?
                              (
                                <div className='flex flex-col gap-3'>
                                  {
                                    filtersData?.[0]?.filters?.map((row, index) => (
                                      <div key={index} className="p-2 text-center cursor-pointer"
                                        onClick={() => {
                                          // console.log('row.value', row.value)
                                          setFilters(row.value)
                                        }}
                                      >
                                        <img
                                          className="rounded-sm w-48 h-48 object-cover mx-auto"
                                          src="https://images.unsplash.com/photo-1737712334383-debc45ffa906?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                          alt={row.name}
                                          style={{ filter: row.value }}

                                        />
                                        <p className="mt-2 text-sm font-medium">{row.name}</p>
                                      </div>
                                    ))
                                  }

                                </div>
                              )
                              :
                              (
                                <div>
                                  <p className='text-gray-300 text-sm mt-4'>The left sidebar contains a variety of creative tools.</p>
                                  <p className='text-gray-300 text-sm mt-4'>Tool-specific settings and options will appear here once you select a tool.</p>
                                  <p className='text-gray-300 text-sm mt-4'>The Crop tool should be used before adding any text behind the image.</p>
                                  <p className='text-gray-300 text-sm mt-4'>Some features and tools are available exclusively to premium users.</p>
                                  <p className='text-gray-300 text-sm mt-4'>You can draw, erase, add stickers, text, or apply effects — all from the left panel.</p>
                                  <p className='text-gray-300 text-sm mt-4'>Make sure to save your work regularly to avoid losing changes.</p>
                                  <p className='text-gray-300 text-sm mt-4'>For best results, use high-resolution images while editing.</p>
                                  <p className='text-gray-300 text-sm mt-4'>Tip: You can combine multiple tools for more creative control.</p>
                                  <p className='text-gray-300 text-sm mt-4'>✨ Start creating — your canvas is ready!</p>
                                </div>

                              )


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