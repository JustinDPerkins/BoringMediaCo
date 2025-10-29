import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  Switch,
  FormControlLabel,
  Paper,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';

const Submissions: React.FC = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [securityEnabled, setSecurityEnabled] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFile(file);

    // Create preview URL for video/image files
    if (file.type.startsWith('video/') || file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }

    setUploadError(null);
    setScanResult(null);
  };

  const handleSubmit = async () => {
    if (!uploadFile) {
      setUploadError('Please upload a file first');
      return;
    }

    setUploadError(null);
    setScanResult(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('file', uploadFile, uploadFile.name);

      const endpoint = securityEnabled ? '/api/sdk/upload' : '/api/sdk/upload-vulnerable';
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      
      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status} ${res.statusText}`);
      }
      
      const json = await res.json();
      setScanResult(json);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setSubmitting(false);
    }
  };

  const isVideo = uploadFile?.type.startsWith('video/');
  const isImage = uploadFile?.type.startsWith('image/');
  const isSuccess = scanResult?.scan_result_code === 0;
  
  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        p: { xs: 2, sm: 3 },
      }}
    >
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5, color: '#f5f1e8' }}>
            Upload Your Videos
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(245, 241, 232, 0.6)' }}>
            Share your content with the community. Upload videos and test security scanning
          </Typography>
        </Box>

        {/* Main Content - Left/Right Split */}
        <Box sx={{ flex: 1, display: 'flex', gap: 3, minHeight: 0, flexDirection: { xs: 'column', lg: 'row' } }}>
          {/* LEFT SIDE - Upload + Response */}
          <Box sx={{ width: { xs: '100%', lg: '40%' }, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Upload Controls */}
            <Paper sx={{ p: { xs: 2, sm: 3 }, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              {/* File Upload Area */}
              <Box
                sx={{
                  border: '2px dashed rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: { xs: 2, sm: 3 },
                  textAlign: 'center',
                  background: 'rgba(0,0,0,0.2)',
                  mb: 2,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: 'rgba(255,255,255,0.4)',
                    background: 'rgba(0,0,0,0.3)',
                  },
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <UploadIcon sx={{ fontSize: { xs: 36, sm: 48 }, color: 'rgba(255,255,255,0.5)', mb: 1 }} />
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', wordBreak: 'break-word' }}>
                  {uploadFile ? uploadFile.name : 'Click to upload video'}
                </Typography>
              </Box>

              {/* File Info */}
              {uploadFile && (
                <Box sx={{ mb: 2 }}>
                  <Chip
                    icon={<CheckCircleIcon />}
                    label={uploadFile.name}
                    size="small"
                    sx={{
                      background: 'rgba(76, 175, 80, 0.2)',
                      color: '#81c784',
                      mb: 0.5,
                    }}
                  />
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 0.5 }}>
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              )}

              {/* Security Toggle */}
              <FormControlLabel
                control={
                  <Switch
                    checked={securityEnabled}
                    onChange={(e) => setSecurityEnabled(e.target.checked)}
                    sx={{
                      '& .MuiSwitch-switchBase.Mui-checked': {
                        color: '#4caf50',
                      },
                      '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                        backgroundColor: '#4caf50',
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.875rem' }}>
                    {securityEnabled ? '🛡️ Protected Scan' : '⚠️ Vulnerable Scan'}
                  </Typography>
                }
                sx={{ mb: 2 }}
              />

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={submitting || !uploadFile}
                variant="contained"
                fullWidth
                sx={{
                  background: securityEnabled ? 'rgba(0,128,255,0.3)' : 'rgba(255,0,0,0.3)',
                  color: 'white',
                  py: 1.5,
                  '&:hover': {
                    background: securityEnabled ? 'rgba(0,128,255,0.4)' : 'rgba(255,0,0,0.4)',
                  },
                  '&:disabled': {
                    background: 'rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.3)',
                  },
                }}
              >
                {submitting ? 'Uploading…' : 'Upload Video'}
              </Button>

              {/* Error */}
              {uploadError && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {uploadError}
                </Alert>
              )}
            </Paper>

            {/* Scan Results */}
            <Paper sx={{ p: { xs: 1.5, sm: 2 }, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', flex: 1, display: 'flex', flexDirection: 'column', minHeight: { xs: '200px', lg: 'auto' } }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)', mb: { xs: 1, sm: 1.5 }, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                Upload Status
              </Typography>

              {scanResult ? (
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                  {/* Status Chip */}
                  <Chip
                    label={isSuccess ? '✅ Upload Complete' : '❌ Upload Failed'}
                    size="small"
                    sx={{
                      background: isSuccess ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                      color: isSuccess ? '#81c784' : '#ef5350',
                      mb: 1.5,
                    }}
                  />

                  {/* Compact JSON Display */}
                  <Box sx={{ background: 'rgba(0,0,0,0.3)', p: { xs: 1, sm: 1.5 }, borderRadius: 1, flex: 1, overflow: 'auto' }}>
                    <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', lineHeight: 1.3 }}>
                      {JSON.stringify(scanResult, null, 2)}
                    </pre>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    {uploadFile ? 'Ready to upload' : 'Select a video to upload'}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>

          {/* RIGHT SIDE - Video Preview */}
          <Box sx={{ width: { xs: '100%', lg: '60%' } }}>
            <Paper sx={{ p: { xs: 2, sm: 3 }, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', height: '100%', display: 'flex', flexDirection: 'column', minHeight: { xs: '300px', lg: 'auto' } }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)', mb: { xs: 1.5, sm: 2 }, fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                Video Preview
              </Typography>
              
              {previewUrl ? (
                <Box
                  sx={{
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: 2,
                    overflow: 'hidden',
                    flex: 1,
                    minHeight: 0,
                    background: '#000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {isVideo ? (
                    <video
                      src={previewUrl}
                      controls
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : isImage ? (
                    <Box
                      component="img"
                      src={previewUrl}
                      alt="Preview"
                      sx={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                      }}
                    />
                  ) : (
                    <Typography sx={{ color: 'rgba(255,255,255,0.4)' }}>
                      Unsupported file type
                    </Typography>
                  )}
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, background: 'rgba(0,0,0,0.2)', borderRadius: 2 }}>
                  <Typography sx={{ color: 'rgba(255,255,255,0.4)', textAlign: 'center' }}>
                    Select a video to preview
                  </Typography>
                </Box>
              )}
            </Paper>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Submissions;