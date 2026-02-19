import React, { useState } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { motion } from 'framer-motion';
import {
  Upload,
  Image as ImageIcon,
  Info,
  DollarSign,
  Calendar,
  Palette,
  Ruler,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ImageUpload } from '@/components/ImageUpload';

export default function ArtworkSubmission() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [technique, setTechnique] = useState('');
  const [medium, setMedium] = useState('');
  const [dimensions, setDimensions] = useState('');
  const [genre, setGenre] = useState('');
  const [basePrice, setBasePrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  // Create artwork mutation
  const createArtworkMutation = trpc.artwork.create.useMutation({
    onSuccess: (data) => {
      toast({
        title: 'Success!',
        description: 'Your artwork has been submitted successfully. It will be reviewed by our team.',
      });
      
      // Reset form
      setTitle('');
      setDescription('');
      setYear(new Date().getFullYear().toString());
      setTechnique('');
      setMedium('');
      setDimensions('');
      setGenre('');
      setBasePrice('');
      setImageUrl('');
      
      // Redirect to artworks page
      setTimeout(() => {
        setLocation('/artworks');
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to submit artwork',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!title || !description || !year || !basePrice) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const price = parseFloat(basePrice);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Invalid Price',
        description: 'Please enter a valid price',
        variant: 'destructive',
      });
      return;
    }

    // Submit artwork
    createArtworkMutation.mutate({
      title,
      description,
      artistId: user?.id || 1, // Should be linked to artist profile
      year: parseInt(year),
      technique: technique || undefined,
      medium: medium || 'Oil on Canvas',
      dimensions: dimensions || undefined,
      genre: genre || undefined,
      basePrice: basePrice,
      currentPrice: basePrice,
      imageUrl: imageUrl || undefined,
      status: 'available',
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to submit artwork</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/login')} className="w-full">
              Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Check if user is artist or gallery
  const canSubmit = user?.role === 'artist' || user?.role === 'gallery' || user?.role === 'admin';
  
  if (!canSubmit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only artists and galleries can submit artworks</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={() => setLocation('/')} variant="outline" className="w-full">
              Go Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/artworks')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Artworks
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Upload className="w-8 h-8" />
            Submit New Artwork
          </h1>
          <p className="text-gray-600 mt-2">
            Submit your artwork for review. All submissions will be verified by our team.
          </p>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <form onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>Artwork Details</CardTitle>
                <CardDescription>
                  Provide detailed information about your artwork
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter artwork title"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description" className="flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your artwork, its inspiration, and significance"
                    rows={4}
                    required
                  />
                </div>

                {/* Year & Medium */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="year" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Year of Creation *
                    </Label>
                    <Input
                      id="year"
                      type="number"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      min="1800"
                      max={new Date().getFullYear()}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="medium" className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      Medium
                    </Label>
                    <Select value={medium} onValueChange={setMedium}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select medium" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oil on Canvas">Oil on Canvas</SelectItem>
                        <SelectItem value="Acrylic on Canvas">Acrylic on Canvas</SelectItem>
                        <SelectItem value="Watercolor">Watercolor</SelectItem>
                        <SelectItem value="Mixed Media">Mixed Media</SelectItem>
                        <SelectItem value="Digital Art">Digital Art</SelectItem>
                        <SelectItem value="Photography">Photography</SelectItem>
                        <SelectItem value="Sculpture">Sculpture</SelectItem>
                        <SelectItem value="Installation">Installation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Technique & Genre */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="technique">Technique</Label>
                    <Input
                      id="technique"
                      value={technique}
                      onChange={(e) => setTechnique(e.target.value)}
                      placeholder="e.g., Impressionism, Abstract"
                    />
                  </div>

                  <div>
                    <Label htmlFor="genre">Genre</Label>
                    <Select value={genre} onValueChange={setGenre}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select genre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Abstract">Abstract</SelectItem>
                        <SelectItem value="Contemporary">Contemporary</SelectItem>
                        <SelectItem value="Modern">Modern</SelectItem>
                        <SelectItem value="Classical">Classical</SelectItem>
                        <SelectItem value="Portrait">Portrait</SelectItem>
                        <SelectItem value="Landscape">Landscape</SelectItem>
                        <SelectItem value="Still Life">Still Life</SelectItem>
                        <SelectItem value="Conceptual">Conceptual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Dimensions */}
                <div>
                  <Label htmlFor="dimensions" className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Dimensions (cm)
                  </Label>
                  <Input
                    id="dimensions"
                    value={dimensions}
                    onChange={(e) => setDimensions(e.target.value)}
                    placeholder="e.g., 100 x 80 x 5"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Format: Width x Height x Depth (optional)
                  </p>
                </div>

                {/* Base Price */}
                <div>
                  <Label htmlFor="basePrice" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Base Price (USD) *
                  </Label>
                  <Input
                    id="basePrice"
                    type="number"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Set your asking price. This can be updated later.
                  </p>
                </div>

                {/* Image Upload with Drag & Drop */}
                <div>
                  <Label className="flex items-center gap-2 mb-4">
                    <ImageIcon className="w-4 h-4" />
                    Изображение произведения
                  </Label>
                  <ImageUpload
                    onUploadComplete={(urls) => {
                      setImageUrl(urls.large);
                      toast({
                        title: 'Изображение загружено!',
                        description: 'Изображение успешно загружено и оптимизировано.',
                      });
                    }}
                    maxSizeMB={10}
                    showPreview={true}
                  />
                  {imageUrl && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800 font-medium">
                          Изображение загружено
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation('/artworks')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createArtworkMutation.isPending}
                >
                  {createArtworkMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Submit Artwork
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </motion.div>

        {/* Info Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Info className="w-5 h-5" />
              Submission Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <ul className="list-disc list-inside space-y-2">
              <li>All artworks will be reviewed by our verification team</li>
              <li>High-quality images (minimum 1024x768px) are recommended</li>
              <li>Provide accurate and detailed descriptions</li>
              <li>Pricing should reflect market value and artwork significance</li>
              <li>Once approved, your artwork will be visible to collectors</li>
              <li>You'll be notified via email about the review status</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
